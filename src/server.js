const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Client } = require('pg');


const packageDefinition = protoLoader.loadSync('service.proto', {});
const proto = grpc.loadPackageDefinition(packageDefinition).products;



const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'northwind',
  password: 'postgres',
  port: 55432,
});

async function main() {
    await client.connect();
    console.log('Connected to PostgreSQL');
  
    const server = new grpc.Server();
    server.addService(proto.ProductService.service, {
      getProducts: getProducts,
      GetProductById: getProductById
    });
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        console.error(error);
        return;
      }
      server.start();
      console.log(`Server running at http://127.0.0.1:${port}`);
    });
  }


const getProductById = async (call, callback) => {
    const { id } = call.request; 
    try {
      const result = await client.query('SELECT Product_ID AS id, Product_Name AS name, Category_ID AS category, Unit_Price AS price FROM Products WHERE Product_ID = $1', [id]);
      if (result.rows.length === 0) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'Product not found'
        });
      } else {
        const product = result.rows[0];
        callback(null, { product: {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price
        }});
      }
    } catch (err) {
      console.error('Database query error:', err);
      callback({
        code: grpc.status.INTERNAL,
        details: 'Error fetching product: ' + err.message
      });
    }
  };

  
  const getProducts = async (call, callback) => {
    try {
      const result = await client.query('SELECT Product_ID AS id, Product_Name AS name, Category_ID AS category, Unit_Price AS price FROM Products');
      const products = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price
      }));
      callback(null, { products });
    } catch (err) {
      console.error(err);
      callback({
        code: grpc.status.INTERNAL,
        details: 'Error fetching products'
      });
    }
  };

  main().catch(console.error);

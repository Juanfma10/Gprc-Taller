const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Cargar el archivo .proto
const packageDefinition = protoLoader.loadSync('service.proto', {});
const proto = grpc.loadPackageDefinition(packageDefinition).products;

// Inicializar el cliente
function main() {
  const client = new proto.ProductService('127.0.0.1:50051', grpc.credentials.createInsecure());

  // Obtener todos los productos
  client.GetProducts({}, (error, response) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log('Products:', response.products);
  });
  
  
  const getProduct = (product_id) => {
    client.GetProductById({ id: product_id }, (error, response) => {
        if (error) {
            console.error('Error fetching product:', error);
        } else {
            console.log('Product details:', response.product);
        }
    });
  };

getProduct(72);
}



main();
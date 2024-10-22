const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Configura Express
const app = express();
const PORT = 3000;

const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const northwindProto = grpc.loadPackageDefinition(packageDefinition).products;

// Crea un cliente gRPC
const client = new northwindProto.ProductService('localhost:50051', grpc.credentials.createInsecure());
app.use(express.static('public'));

// Rutaas
app.get('/api/products', (req, res) => {
    client.GetProducts({}, (error, response) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(response.products);
    });
});

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    client.GetProductById({ id: productId }, (error, response) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(response.product);
    });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

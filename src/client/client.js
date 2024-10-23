const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./src/service.proto', {});
const proto = grpc.loadPackageDefinition(packageDefinition).products;

const client = new proto.ProductService(
  'localhost:50051',
  grpc.credentials.createInsecure()
)

console.log("servidor corriendo en 50051")
module.exports = client

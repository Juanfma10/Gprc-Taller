const express = require('express');
const client = require('./client');
const app = express();
const PORT = 5555;

app.use(express.static('./src/public'));

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

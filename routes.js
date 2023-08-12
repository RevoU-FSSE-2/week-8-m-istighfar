"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let products = [];
let lastId = 0;
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// Get all products with optional filtering by name and category
router.get('/products', (req, res) => {
    let filteredProducts = products;
    // Filter by name if "name" query parameter is provided
    const searchName = req.query.name;
    if (searchName) {
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    // Filter by category if "category" query parameter is provided
    const categoryFilter = req.query.type;
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => product.type === categoryFilter);
    }
    // Calculate total price for each category
    const totalCashIn = products
        .filter(product => product.type === "Kas Masuk")
        .reduce((sum, product) => sum + product.amount, 0);
    const totalCashOut = products
        .filter(product => product.type === "Kas Keluar")
        .reduce((sum, product) => sum + product.amount, 0);
    // Calculate the balance
    const balance = totalCashIn - totalCashOut;
    res.json({
        products: filteredProducts,
        totalCashIn: totalCashIn,
        totalCashOut: totalCashOut,
        balance: balance
    });
});
//Get product by ID
router.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const product = products.find((p) => p.id === id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
});
//Post
router.post('/products', (req, res) => {
    lastId++;
    const newProduct = {
        id: lastId,
        name: req.body.name,
        amount: req.body.amount,
        type: req.body.type
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});
router.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
        const updatedProduct = {
            id,
            name: req.body.name,
            amount: req.body.amount,
            type: req.body.type
        };
        products[productIndex] = updatedProduct;
        res.json(updatedProduct);
    }
    else {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
});
router.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
        const updatedProduct = Object.assign(Object.assign({}, products[productIndex]), req.body);
        products[productIndex] = updatedProduct;
        res.json(updatedProduct);
    }
    else {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
});
router.delete('/products', (req, res) => {
    products = [];
    res.json({ message: 'Semua produk telah dihapus' });
});
router.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1)[0];
        res.json(deletedProduct);
    }
    else {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
});
exports.default = router;

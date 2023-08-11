"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const app = (0, express_1.default)();
const port = 3000;
let products = [];
let lastId = 0;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
const users = {
    'revou': 'tim6'
};
app.use((0, express_basic_auth_1.default)({
    users: users,
    challenge: true,
    unauthorizedResponse: 'Access Denied'
}));
// app.use('/api');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// Get all products with optional filtering by name and category
app.get('/products', (req, res) => {
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
    res.json({ message: 'Semua produk telah didapatkan',
        products: filteredProducts,
        totalCashIn: totalCashIn,
        totalCashOut: totalCashOut,
        balance: balance
    });
});
//Get product by ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find((p) => p.id === id);
    if (product) {
        res.json({ message: 'Produk telah didapatkan', product });
    }
    else {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
});
//Post
app.post('/products', (req, res) => {
    lastId++;
    const newProduct = {
        id: lastId,
        name: req.body.name,
        amount: req.body.amount,
        type: req.body.type
    };
    products.push(newProduct);
    res.status(201).json({ message: 'Produk telah ditambahkan', newProduct });
});
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
        const updatedProduct = {
            id,
            name: req.body.name,
            amount: req.body.amount,
            type: req.body.type
        };
        products[productIndex] = updatedProduct;
        res.json({ message: 'Produk telah diupdate', updatedProduct });
    }
    else {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
});
app.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
        const updatedProduct = Object.assign(Object.assign({}, products[productIndex]), req.body);
        products[productIndex] = updatedProduct;
        res.json({ message: 'Produk telah diupdate', updatedProduct });
    }
    else {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
});
app.delete('/products', (req, res) => {
    products = [];
    res.json({ message: 'Semua produk telah dihapus' });
});
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1)[0];
        res.json({ message: 'Produk tidak dihapus', deletedProduct });
    }
    else {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
});
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

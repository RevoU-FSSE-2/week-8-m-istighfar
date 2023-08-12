import { Router, Request, Response } from 'express';

const router = Router();

interface Product {
  id: number;
  name: string;
  amount: number;
  type: string;
}

let products: Product[] = [];
let lastId : number = 0;

router.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/public/index.html');
  });
  
  // Get all products with optional filtering by name and category
router.get('/products', (req: Request, res: Response) => {
    let filteredProducts = products;
  
  // Filter by name if "name" query parameter is provided
    const searchName = req.query.name as string | undefined;
    if (searchName) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchName.toLowerCase())
        );
    }
  
  // Filter by category if "category" query parameter is provided
    const categoryFilter = req.query.type as string | undefined;
    if (categoryFilter) {
            filteredProducts = filteredProducts.filter(product => 
              product.type.toLowerCase() === categoryFilter.toLowerCase()
          );
    }
  
    // Calculate total price for each category
    const totalCashIn = products
        .filter(product => product.type.toLowerCase() === "kas keluar")
        .reduce((sum, product) => sum + product.amount, 0);
  
    const totalCashOut = products
        .filter(product => product.type.toLowerCase() === "kas keluar")
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
router.get('/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id,10);
    const product = products.find((p) => p.id === id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  });
  
  //Post
router.post('/products', (req: Request, res: Response) => {
    lastId++
    const newProduct: Product = {
      id: lastId,
      name: req.body.name,
      amount: req.body.amount,
      type: req.body.type
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  });
  
  
  
router.put('/products/:id', (req: Request, res: Response) => {
   const id = parseInt(req.params.id,10);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const updatedProduct: Product = {
        id,
        name: req.body.name,
        amount: req.body.amount,
        type: req.body.type
      };
      products[productIndex] = updatedProduct;
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  });
  
router.patch('/products/:id', (req: Request, res: Response) => {
   
   const id = parseInt(req.params.id,10);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const updatedProduct: Product = {
        ...products[productIndex],
        ...req.body
      };
      products[productIndex] = updatedProduct;
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  }); 
  
router.delete('/products', (req: Request, res: Response) => {
    products = [];  
    res.json({ message: 'Semua produk telah dihapus' });
  });
  
  
router.delete('/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id,10);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const deletedProduct = products.splice(productIndex, 1)[0];
      res.json(deletedProduct);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  });

export default router;

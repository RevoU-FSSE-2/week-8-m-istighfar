import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';


const app = express();
const port = 3000;


interface Product {
  id: number;
  name: string;
  amount: number;
  type: string;
}

let products: Product[] = [
];

let lastId = 0;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const users = {
  'revou': 'tim6'
};

app.use(basicAuth({
  users: users,
  challenge: true, 
  unauthorizedResponse: 'Access Denied'
}));

// app.use('/api');
app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Get all products with optional filtering by name and category
app.get('/products', (req: Request, res: Response) => {
  let filteredProducts = products;

// Filter by name if "name" query parameter is provided
  const searchName = req.query.name as string;
  if (searchName) {
      filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchName.toLowerCase())
      );
  }

// Filter by category if "category" query parameter is provided
  const categoryFilter = req.query.type as string;
  if (categoryFilter) {
      filteredProducts = filteredProducts.filter(product => 
          product.type=== categoryFilter
      );
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

  res.json({message: 'Semua produk telah didapatkan',
      products: filteredProducts,
      totalCashIn: totalCashIn,
      totalCashOut: totalCashOut,
      balance: balance
  });
});

//Get product by ID
app.get('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);
  if (product) {
    res.json({message: 'Produk telah didapatkan', product});
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
});

//Post
app.post('/products', (req: Request, res: Response) => {
  lastId++
  const newProduct: Product = {
    id: lastId,
    name: req.body.name,
    amount: req.body.amount,
    type: req.body.type
  };
  products.push(newProduct);
  res.status(201).json({message: 'Produk telah ditambahkan', newProduct});
});



app.put('/products/:id', (req: Request, res: Response) => {
 const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex !== -1) {
    const updatedProduct: Product = {
      id,
      name: req.body.name,
      amount: req.body.amount,
      type: req.body.type
    };
    products[productIndex] = updatedProduct;
    res.json({message: 'Produk telah diupdate', updatedProduct});
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
});

app.patch('/products/:id', (req: Request, res: Response) => {
 
 const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex !== -1) {
    const updatedProduct: Product = {
      ...products[productIndex],
      ...req.body
    };
    products[productIndex] = updatedProduct;
    res.json({message: 'Produk telah diupdate', updatedProduct});
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
}); 

app.delete('/products', (req: Request, res: Response) => {
  products = [];  
  res.json({ message: 'Semua produk telah dihapus' });
});


app.delete('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1)[0];
    res.json({message: 'Produk tidak dihapus', deletedProduct});
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
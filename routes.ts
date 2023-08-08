import express, { Request, Response } from 'express';

const router = express.Router();

interface Product {
  id: number;
  name: string;
  price: number;
}

let products: Product[] = [
//   { id: 1, name: 'Product A', price: 10 },
//   { id: 2, name: 'Product B', price: 20 },
];

router.get('/products', (req: Request, res: Response) => {
  res.json(products);
});

router.get('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
});

router.post('/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex !== -1) {
    const updatedProduct: Product = {
      id,
      name: req.body.name,
      price: req.body.price,
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
});

router.patch('/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const updatedProduct: Product = {
        ...products[productIndex],
        ...req.body,
      };
      products[productIndex] = updatedProduct;
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  });  

router.delete('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1)[0];
    res.json(deletedProduct);
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
});

export default router;

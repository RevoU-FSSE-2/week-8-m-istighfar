import express from 'express';
// import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
const port = 3000;

// app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

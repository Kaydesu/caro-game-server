import express from 'express';
import {
  routes
} from './routes';

import cors from 'cors';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());
// Config routing
routes.map(route => {
  app.use(`/api/${route.path}`, route.router);
})


app.listen(PORT, () => {
  console.log(`Server start on PORT: ${PORT}`);
})
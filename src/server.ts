import express from 'express';
import MQTTService from './class/MQTTService';
import {
  routes
} from './routes';

MQTTService

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
// Config routing
routes.map(route => {
  app.use(`/api/${route.path}`, route.router);
})


app.listen(PORT, () => {
  console.log(`Server start on PORT: ${PORT}`);
})
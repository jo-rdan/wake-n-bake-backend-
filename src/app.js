import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/', routes);
app.use('/', (req, res) => res
  .status(200)
  .json({ status: 200, message: "Welcome to Wake N' Bake delivery app!" }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`App is listening on port ${PORT}`));

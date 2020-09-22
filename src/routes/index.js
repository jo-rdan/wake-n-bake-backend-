import express from 'express';
import userRoute from './userRoutes';

const route = express();

route.use('/users', userRoute);

export default route;

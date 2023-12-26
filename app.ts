import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes';

const app=express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/api',apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/useRoutes.js'
import postRoutes from './routes/postRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import mongoose from 'mongoose'
import{v2 as cloudinary} from 'cloudinary'

import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
const app=express()
app.use(cookieParser());
app.use(express.json({limit:"5mb"}))
app.use('/api/users', authenticateUser, userRoutes);
app.use("/api/auth",authRoutes)
app.use("/api/posts",authenticateUser,postRoutes)
app.use("/api/notifications",authenticateUser,notificationRoutes)

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(express.static(path.resolve(__dirname, './frontend/dist')));


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './frontend/dist', 'index.html'));
});



app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found' });
  });
  
 app.use(errorHandlerMiddleware);
  
const port=process.env.PORT

try {
   await mongoose.connect(process.env.MONGO_URI)
    app.listen(port,()=>{
        console.log(`server is runnning on port ${port}`);
    })
    
} catch (error) {
    console.log(error);
    process.exit(1);
}

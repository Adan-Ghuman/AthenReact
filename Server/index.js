import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); //Allows us to parse incoming requests :req.body
app.use(cookieParser());

app.use('/api/auth',authRoutes)



app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port:`, PORT);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error(err);
    }});
    
// aNa9MBJ4mi2n73xo

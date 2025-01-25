import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


// middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); //Allows us to parse incoming requests :req.body
app.use(cookieParser());

app.use('/api/auth',authRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/Client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,"Client","dist","index.html"));
    });
}



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

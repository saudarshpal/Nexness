import express from 'express';
import type{ Request, Response } from 'express';
import primaryRouter from './routes/index.route'; 
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';


const app = express();
const PORT = process.env.PORT || 3001

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,               
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization',"Cookies"]
}))
app.use(express.json());
app.use(cookieParser())



app.get('/api/health',(req: Request ,res : Response)=>{
   res.status(200).json({status : "✅OK"})
});
app.use('/api',primaryRouter);
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log("✅ api-service Up and Running")
})
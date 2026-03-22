import type{ Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken'
import { catchAsync } from '../utils/catchAsync';
import { AppError } from './errorHandler';
import { ResponseStatus } from '../types';

declare global {
    namespace Express {
        interface Request {
            user : {
                userId : string,
                email : string
            }
        }
    }
}
interface JwtPayload {
    userId : string,
    email : string
}

export const authMiddleware = (req : Request, res:Response, next:NextFunction)=>{
        const token = req.cookies.token;
        if(!token) throw new AppError(ResponseStatus.UNAUTHORIZED,"Invliad Token");
        const decoded = jwt.verify(token,"jwtsecret") as JwtPayload ; 
        req.user = {
            userId : decoded.userId,
            email : decoded.email,
        };
    next();
}
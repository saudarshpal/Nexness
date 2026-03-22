import type{ Request,Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { signinSchema, signupSchema } from '../schemas/auth.schema';
import { AppError } from '../middlewares/errorHandler';
import { ResponseStatus } from '../types';
import bcrypt from 'bcrypt';
import { prisma } from '@repo/database';
import jwt from 'jsonwebtoken';


export const Signup = catchAsync(async(req : Request, res : Response)=>{

    const result = signupSchema.safeParse(req.body);
    if(!result.success) throw new AppError(ResponseStatus.BAD_REQUEST,"Validation Error");
    const { email,password,name } = result.data;
   
    const existingUser = await prisma.user.findFirst({
        where : { email }
    })
    if(existingUser) throw new AppError(ResponseStatus.BAD_REQUEST,"User Already Exist/ Try Signin");

    const salt =  await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    const user = await prisma.user.create({
        data : {
            email,
            password : hashPassword,
            name,
            walletBalance : 0
    },
        select : {
            id : true,
            email : true,
            name : true
    }
    });

    const token = jwt.sign({ userId : user.id ,email : user.email}, "jwtsecret", {  expiresIn : "2h"});
    
    res.cookie("token",token,{
        httpOnly : true,
        sameSite : "lax",
        secure : false,
        maxAge : 1000 * 60 * 60 * 2

    })
    return res.status(ResponseStatus.CREATED).json({msg : "User Created Successfully", user});
});


export const Signin = catchAsync(async(req : Request, res: Response)=>{
    const result = signinSchema.safeParse(req.body);
    if(!result.success) throw new AppError(ResponseStatus.BAD_REQUEST,"Validation Error");
    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ 
        where : {email}
    });
    if(!user) throw new AppError(ResponseStatus.NOT_FOUND,"User Not Found");

    const isMatch = await bcrypt.compare(password,user.password) 
    if(!isMatch) throw new AppError(ResponseStatus.UNAUTHORIZED,"Invalid Password");

    const token = jwt.sign({ userId : user.id , email : user.email},"jwtsecret",{expiresIn : '2h'});

    res.cookie("token",token,{
        httpOnly : true,
        sameSite : "lax",
        secure : false ,
        maxAge : 1000 * 60 * 60 * 2
    })

    res.status(ResponseStatus.OK).json({msg : "User Logged In Successfully",
        user : {
            id : user.id,
            email : user.email,
            name : user.name
    }})

});

export const Logout = catchAsync(async(req: Request, res: Response)=>{
    res.clearCookie("token",{
        httpOnly : true,
        sameSite : "lax",
        secure : false
    })
    return res.status(ResponseStatus.OK).json({msg: "Logged Out Successfully"});
})

export const Me = catchAsync(async(req : Request, res: Response)=>{
    const userId  = req.user.userId;
    const user = await prisma.user.findUnique({
        where : {id : userId},
        select : {
            email : true,
            name : true ,
            walletBalance : true
        }
    });
    if(!user) throw new AppError(ResponseStatus.NOT_FOUND,"User Not Found");
    res.status(ResponseStatus.OK).json({user});

})
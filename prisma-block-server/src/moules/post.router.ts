
import express, { Response, Router,Request, NextFunction } from 'express';
import { PostController } from './post.controller';
import auth, { UserRole } from '../middlewares/auth';

// import auth, { UserRole } from '../../middlewares/auth';


const router = express.Router();
// declare global {
//     namespace Express {
//         interface Request {
//             user?:{
//                 id:string,
//                 email:string,
//                 name:string,
//                 role:string,
//                 emailVerified:boolean
//             }
//         }
//     }
// }
//  export enum UserRole{
//     USER='USER',
//     ADMIN='ADMIN'
//  }

// const auth = (...role:UserRole[])=>{
//     return async(req:Request,res:Response,next:NextFunction)=>{
//         // get user session
//         const session=await betterAuth.api.getSession({
//             headers:req.headers as any
//         })
       
//         if(!session){
//             return res.status(401).json({
//                 message:"you are not authorize",
//                 success:false
//             })
//         }
//         if(!session.user.emailVerified){
//              return res.status(403).json({
//                 message:"Email verification required. please verify your email",
//                 success:false
//             })


//         }
//         req.user={
//             id:session.user.id,
//             email:session.user.email,
//             role:session.user.role as string,
//             emailVerified:true,
//             name:session.user.name

//         }
//         if(role.length && !role.includes(req.user.role as UserRole)){

//           return res.status(403).json({
//                 message:"Forbidden ! you don't permission to access this recorccess",
//                 success:false
//             })
//         }
    
//        next()

//     }
// }
router.get("/",PostController.getAllPost)

router.post(
    "/",
    auth(UserRole.USER),
    PostController.createPost
)

export const postRouter: Router = router;
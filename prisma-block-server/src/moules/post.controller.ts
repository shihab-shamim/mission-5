import { Result } from './../../generated/prisma/internal/prismaNamespace';

import { Request, Response } from "express";
import { postService } from "./post.service";

import { PostStatus } from "../../generated/prisma/enums";
import paginationSortingHelper from "../helpers/paginationSortingHelper";
import { success } from "better-auth/*";
import { error } from 'node:console';
import e from 'cors';
import { UserRole } from '../middlewares/auth';


const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    
    // console.log({page,limit});
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post creation failed",
      details: e,
    });
  }
};
const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req?.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    // const page=Number(req.query.page ?? 1);
    // const limit=Number(req.query.limit ?? 10);
    // const skip=(page-1)*limit
    // const sortOder=req.query.sortOder as string | undefined;
    // const sortBy=req.query.sortBy as string | undefined

    const options=paginationSortingHelper(req.query)
   const {  page,limit,skip,sortBy,sortOder}=options

    // true or false
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;
      const status=req.query.status as PostStatus |undefined

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,page,skip,sortBy,sortOder,limit
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post Get failed",
      details: e,
    });
  }
};

const getSinglePostById=async(req: Request, res: Response)=>{
 
  // console.log(id);

  try {
     const id =req.params.postId as string  ;
     if(!id){
    //    res.status(400).send({
    //   message:"Post Get by Id failed",
    //   success:false
    // })
    throw  error("Post Id Is Required")
     }
     const result=await postService.getSinglePostById(id)
     res.send(result)
    
  } catch (error) {
    res.status(400).send({
      message:"Post Get by Id failed",
      success:false
    })
    
  }

}

const getMyPost=async(req: Request, res: Response)=>{
 
  // console.log(id);

  try {
     const user =req.user ;
     if(!user){
    //    res.status(400).send({
    //   message:"Post Get by Id failed",
    //   success:false
    // })
    throw  error("You are unauthorize")
     }
     const result=await postService.getMyPost(user.id)
     res.send(result)
    
  } catch (error) {
    res.status(400).send({
      message:"Post fatche failed",
      success:false
    })
    
  }

}



const updatePost=async(req: Request, res: Response)=>{
 
  // console.log(id);


  try {
     const user =req.user ;
     if(!user){
    //    res.status(400).send({
    //   message:"Post Get by Id failed",
    //   success:false
    // })
    throw  error("You are unauthorize")
     }
     const {postId}=req.params
     const isAdmin= user.role=== UserRole.ADMIN
     const result=await postService.updatePost(postId as string,req.body,user.id,isAdmin)
     res.send(result)
    
  } catch (error) {
    const errorMessage=(error instanceof Error) ?error.message :"Post updated failed"
    res.status(400).send({
      message:errorMessage,
      success:false
    })
    
  }

}
const deletePost=async(req: Request, res: Response)=>{
 
  // console.log(id);


  try {
     const user =req.user ;
     if(!user){
    //    res.status(400).send({
    //   message:"Post Get by Id failed",
    //   success:false
    // })
    throw  error("You are unauthorize")
     }
     const {postId}=req.params
     const isAdmin= user.role=== UserRole.ADMIN
     const result=await postService.deletePost(postId as string,user.id,isAdmin)
     res.send(result)
    
  } catch (error) {
    const errorMessage=(error instanceof Error) ?error.message :"Post updated failed"
    res.status(400).send({
      message:errorMessage,
      success:false
    })
    
  }

}
const getStats=async(req: Request, res: Response)=>{
 
  // console.log(id);


  try {
    //  const user =req.user ;
    //  if(!user){
    // //    res.status(400).send({
    // //   message:"Post Get by Id failed",
    // //   success:false
    // // })
    // throw  error("You are unauthorize")
    //  }
    //  const {postId}=req.params
    //  const isAdmin= user.role=== UserRole.ADMIN
     const result=await postService.getStats()
     res.send(result)
    
  } catch (error) {
    const errorMessage=(error instanceof Error) ?error.message :"Post updated failed"
    res.status(400).send({
      message:errorMessage,
      success:false
    })
    
  }

}


export const PostController = {
  createPost,
  getAllPost,
 getSinglePostById,getMyPost,updatePost,deletePost,getStats
};

import { auth } from './../../lib/auth';
import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { any } from 'better-auth/*';

const createComment=async(req: Request, res: Response)=>{
    try {
        const user=req.user
     req.body.authorId=user?.id
      
    
      const result = await  commentService.createComment(req.body)
      res.status(201).json(result);
    } catch (e) {
      res.status(400).json({
        error: "comment creation failed",
        details: e,
      });
    }
}
const getCommentById=async(req: Request, res: Response)=>{
    try {
        const commentId=req.params.id as string
        if(!commentId){
            res.status(400).json({
        error: "comment creation failed"
      });
        }

      
    
      const result = await  commentService.getCommentById(commentId)
      res.status(201).json(result);
    } catch (e) {
      res.status(400).json({
        error: "comment creation failed",
        details: e,
      });
    }
}
const getCommentByAuthor = async (req: Request, res: Response) => {
  const authorId = req.params.authorId;

  try {
    if (!authorId) {
      return res.status(400).json({ error: "authorId is required" });
    }

    const result = await commentService.getCommentsByAuthorId(authorId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      error: "comment fetch failed",
      details: e,
    });
  }
};
const deleteComment = async (req: Request, res: Response) => {
  
  try {
    const commentId = req.params.commentId;
  const user=req.user 
    

    const result = await commentService.deleteComment(commentId as string,user?.id as string);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      error: "comment fetch failed",
      details: e,
    });
  }
};
const updateComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentService.updateComment(commentId as string, req.body, user?.id as string)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Comment update failed!",
            details: e
        })
    }
}
const moderateComment = async (req: Request, res: Response) => {
    try {
        // const user = req.user;
        const { commentId } = req.params ;

        const result = await commentService.moderateComment(commentId as string,req.body)
        res.status(200).json(result)
    } catch (e) {
      const errorMessage=(e instanceof Error)? e.message : "Comment update failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}


export const CommentController={
    createComment,getCommentById,getCommentByAuthor,deleteComment,updateComment,moderateComment
}

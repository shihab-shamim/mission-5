
import express, { Response, Router,Request, NextFunction } from 'express';
import { CommentController } from './comment.controller';
import auth, { UserRole } from '../../middlewares/auth';


// import auth, { UserRole } from '../../middlewares/auth';


const router = express.Router();

router.post("/",auth(UserRole?.USER,UserRole?.ADMIN),CommentController.createComment)
router.get("/:id",auth(UserRole?.USER,UserRole?.ADMIN),CommentController.getCommentById)
router.get("/author/:authorId",auth(UserRole?.USER,UserRole?.ADMIN),CommentController.getCommentByAuthor)
router.delete("/deleteComment/:commentId",auth(UserRole?.USER,UserRole?.ADMIN),CommentController.deleteComment)
router.patch(
    "/:commentId",
    auth(UserRole.USER, UserRole.ADMIN),
    CommentController.updateComment
)
router.patch("/:commentId/moderate",auth(UserRole.ADMIN),CommentController.moderateComment)



export const commentRouter: Router = router;
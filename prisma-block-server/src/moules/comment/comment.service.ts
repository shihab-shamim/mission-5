import { Comment } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";

const createComment=async(payload:Comment)=>{
    console.log("create comment ",payload);
    await prisma.post.findUniqueOrThrow({
        where:{
            id:payload.postId
        }
    })
    if(payload.parentId){
        await prisma.comment.findUniqueOrThrow({
            where:{
                id:payload.parentId
            }
        })
    }

    return await prisma.comment.create({
        data:payload
    })
}

const getCommentById=async(id:string)=>{
   const result =await prisma.comment.findUnique({
    where:{
        id
    },
    include:{
        post:{select:{
            id:true,
            title:true,
            views:true
        }}
    }
   })
 return  result

}
 const getCommentsByAuthorId = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: { authorId },
    orderBy:{createdAt:"desc"},
    include:{
        post:{
            select:{id:true,
            title:true}
        }
    }
  });
};
const deleteComment=async(id:string,authorId:string )=>{

    const commentData=await prisma.comment.findFirst({
        where:{
            id,
            authorId
        },
        select:{
            id:true
        }
    })
    if(!commentData){
        throw new Error ("Your provide input is invalid")
    }
    const result= await prisma.comment.delete({
        where:{
            id
        }
    })
    return result
}
export const commentService={
    createComment,getCommentById,getCommentsByAuthorId,deleteComment
}
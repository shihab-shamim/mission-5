import { Result, Either } from './../../generated/prisma/internal/prismaNamespace';
import { count } from "node:console";
import { CommentStatus, Post, PostStatus } from "../../generated/prisma/browser";
import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";
import { promise } from 'better-auth/*';
import { UserRole } from '../middlewares/auth';

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};
const getAllPost = async ({search,tags,isFeatured,status,page,limit,skip,sortOder,sortBy
  }: { search: string | undefined ,tags :string[] |[] ,isFeatured:boolean | undefined,status:PostStatus | undefined,page:number,limit:number,skip:number,sortOder:string |undefined,sortBy:string}) => {
  const andCondition:PostWhereInput[]=[]
 
  if(search){
    andCondition.push(
      {OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },{
          tags: {
            // contains: payload?.search as string,
            // mode: "insensitive",
            has:search as string,
            // mode: "insensitive",


            
          }
        }
      ]})
  }

  if(tags.length>0){
    andCondition.push({tags:{
      hasEvery:tags 

    }})
  }
  if(typeof isFeatured ==='boolean'){
    andCondition.push({isFeatured})
  }
  if(status){
    andCondition.push({status})
  }
  const result = await prisma.post.findMany({
    where: {
    //  AND:[
    //   //  payload?.search ?{ OR: [
    //   //   {
    //   //     title: {
    //   //       contains: payload?.search as string,
    //   //       mode: "insensitive",
    //   //     },
    //   //   },
    //   //   {
    //   //     content: {
    //   //       contains: payload?.search as string,
    //   //       mode: "insensitive",
    //   //     },
    //   //   },{
    //   //     tags: {
    //   //       // contains: payload?.search as string,
    //   //       // mode: "insensitive",
    //   //       has:payload?.search as string,
    //   //       // mode: "insensitive",


            
    //   //     }
    //   //   }
    //   // ]}:{},
     
    // //  {tags:{
    // //   hasEvery:tags 

    // // }}
    //  ]
    AND:andCondition
    },
    skip,
    take:limit,
    orderBy: {
      [sortBy]:sortOder
    },
    include:{
      _count:{select:{comments:true}}
    }
    
  });
  const count=await prisma.post.count({
    where:{
      AND:andCondition
    }
  })
  return {data:result,pagination:{count,page,limit,totalPage:Math.ceil(count/limit)}};
};

const getSinglePostById =async(id:string )=>{
return await prisma.$transaction(async(tx)=>{
    await tx.post.update({
    where:{
      id:id
    },
    data:{
      views:{
        increment:1
      }
    }
  })
  const result =await tx.post.findUnique({
    where:{
      id:id
    },
    include:{
      comments:{
        where:{
          parentId:null,
          status:CommentStatus.APPROVED
        },
        orderBy:{createdAt:"desc"},
         include:{
          replies:{
            where:{
              status:CommentStatus.APPROVED
            },
            orderBy:{createdAt:"asc"},
            include:{
              replies:{
                where:{
              status:CommentStatus.APPROVED
            },
            orderBy:{createdAt:"asc"},
              },
              
            }
          }
         }
      },
      _count:{
        select:{comments:true}
      }
    }
  })
  return result

})
 
}

const getMyPost=async(authorId:string)=>{
  const userInfo=await prisma.user.findUniqueOrThrow({
    where:{
      id:authorId,
      status:"ACTIVE"
    },
    select:{
      id:true
    }
  })
  const result=await prisma.post.findMany({
    where:{
      authorId
    },
    orderBy:{
      createdAt:"desc"
    },
    include:{
      _count:{
        select:{
          comments:true
        }
      }
    }
  })

  const total=await prisma.post.count({
     where:{
      authorId
    },
  })
  //  const total=await prisma.post.aggregate({
  //   where:{
  //     authorId
  //   },
  //    _count:{
  //     id:true
  //   },
  // })

  return{data:result,total}



}


/**
 * user - shudhu nijer post update korte parbe ,isFeatured update korte parbena  
 * admin-  sobar post update korte parbe 
 * 
 */
const updatePost =async(postId:string,data:Partial<Post>,authorId:string,isAdmin:boolean)=>{
  const postData=await prisma.post.findUniqueOrThrow({
    where:{
      id:postId
    },
    select:{
      id:true,authorId:true
    }
  })

  if(  !isAdmin && (postData.authorId!==authorId)){
    throw new Error("tmi ai post ar malik nah")
  }
  if(!isAdmin){
    delete data.isFeatured
  }


  const result=await prisma.post.update({
    where:{
      id:postId
    },
    data
  })

  return result



}


/**
 * user - nijer create post delete korte parbe
 * admin-  sobar post delete korte parbe 
 * 
 */

const deletePost=async(postId:string,authorId:string,isAdmin:boolean)=>{
    const postData=await prisma.post.findUniqueOrThrow({
    where:{
      id:postId
    },
    select:{
      id:true,authorId:true
    }
  })
    if(  !isAdmin && (postData.authorId!==authorId)){
    throw new Error("tmi ai post ar malik nah delete korte parbena")
  }

  return await prisma.post.delete({
    where:{
      id:postId
    }
  })


}

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approveComments,
      RejectComments,
      totalUser,
      AdminCount,
      userCount,
      totalViews
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
      await tx.post.count({ where: { status: PostStatus.DRAFT } }),
      await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
      await tx.comment.count(),
      await tx.comment.count({where:{status:CommentStatus.APPROVED}}),
      await tx.comment.count({where:{status:CommentStatus.REJECT}}),
      await tx.user.count(),
      await tx.user.count({where:{role:UserRole.ADMIN}}),
      await tx.user.count({where:{role:UserRole.USER}}),
      await tx.post.aggregate({_sum:{views:true}}),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approveComments,
      RejectComments,
      totalUser,
      AdminCount,
      userCount,
      totalViews:totalViews._sum
    };
  });
};


export const postService = {
  createPost,
  getAllPost,
  getSinglePostById,getMyPost,updatePost,deletePost,getStats
};

// const getAllPost = async (filters: { authorId?: string; published?: boolean }) => {
//   const result = await prisma.post.findMany({
//     where: {
//       ...(filters.authorId ? { authorId: filters.authorId } : {}),
//       ...(filters.published !== undefined ? { published: filters.published } : {}),
//     },
//   });
//   return result;
// };

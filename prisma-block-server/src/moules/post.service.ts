import { count } from "node:console";
import { CommentStatus, Post, PostStatus } from "../../generated/prisma/browser";
import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

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

export const postService = {
  createPost,
  getAllPost,
  getSinglePostById
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

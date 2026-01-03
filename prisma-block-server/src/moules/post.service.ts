import { Post, PostStatus } from "../../generated/prisma/browser";
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
const getAllPost = async ({search,tags,isFeatured,status}: { search: string | undefined ,tags :string[] |[] ,isFeatured:boolean | undefined,status:PostStatus | undefined}) => {
  const andConditon:PostWhereInput[]=[]
  if(search){
    andConditon.push(
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
    andConditon.push({tags:{
      hasEvery:tags 

    }})
  }
  if(typeof isFeatured ==='boolean'){
    andConditon.push({isFeatured})
  }
  if(status){
    andConditon.push({status})
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
    AND:andConditon
    },
  });
  return result;
};

export const postService = {
  createPost,
  getAllPost,
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

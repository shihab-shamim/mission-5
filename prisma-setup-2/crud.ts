
import { prisma } from "./lib/prisma";

async function run(){
    const createUser=await prisma.user.create({
        data:{
            name:"mitu",
            email:"mitu@prisma.io",
        }
    })
    console.log("Created user:",createUser);
    const createPost=await prisma.post.create({
        data:{
            title:"Hello shihab",
            content:"This is my first post!(shihab)",
            published:true,
            userId:3,
        }
    })
console.log("Created post:",createPost);

const createProfile = await prisma.profile.create({
    data:{
        bio:"I am a software developer",
        userId:3,
    }
})
console.log("Created profile:",createProfile);
// rettive all user 
const getAllUser=await prisma.user.findMany({
    include:{
        posts:true,
        profiles:true,
    },
    // select:{
    //     posts:true,
    //     profiles:true,
    //     name:true,
    //     email:true,
    // }
})

console.dir(getAllUser,{depth:Infinity});


const updateUser = await prisma.user.update({
  where: {
    id: 3,
  },
  data: {
    name: 'update user',
  },
  select:{
    id:true,
    name:true,
    email:true,
    posts:true,
    profiles:true,
  
  }
  
})
console.log("Updated user:",updateUser);

// delete user and recode delete
const deleteUser=await prisma.user.delete({
    where:{
        id:1,
    },
   
})
console.log("Deleted user:",deleteUser);


// upsert ta hocche  paile update hobe naile create hobe
const upsertUser=await prisma.user.upsert({
    where:{
        id:5,
    },
    update:{
        name:"update user",
    },
    create:{
        name:"create user",
        email:"create@prisma.io",
    }
})
console.log("Upsert user:",upsertUser);

}
run() 
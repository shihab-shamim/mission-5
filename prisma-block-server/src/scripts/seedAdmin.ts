
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {
        // check user exixt on db or not 
        const adminData={
            name:"Admin shaheb",
            email:"admin3@gmail.com",
            role:UserRole.ADMIN,
            password:"admin123",
            
        }
        const existingUser=await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        })
        if(existingUser){ 
            throw new Error ("User already exists!!")
        }
      const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });
        if(signUpAdmin.ok){
            await prisma.user.update({
                where:{
                    email:adminData.email as string
                },
                data:{
                    emailVerified:true
                }
            })
        }
        
    } catch (error) {
        console.log(error);
    }
}
seedAdmin()
  import { Verification } from "./../../generated/prisma/client";
  import { betterAuth } from "better-auth";
  import { prismaAdapter } from "better-auth/adapters/prisma";
  import { prisma } from "./prisma";
  import nodemailer from "nodemailer";
  import { use } from "react";

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: "shihabshamim767@gmail.com",
      pass: "vktupvktqlknamiw",
    },
  });

  export const auth = betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "USER",
          require: false,
        },
        phone: {
          type: "string",
          require: false,
        },
        status: {
          type: "string",
          require: false,
          defaultValue: "ACTIVE",
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendOnSignUp:true,
      autoSignInAfterVerification:true,

      sendVerificationEmail: async ({ user, url, token }, request) => {
        //   void sendEmail({
        //     to: user.email,
        //     subject: "Verify your email address",
        //     text: `Click the link to verify your email: ${url}`,
        //   });
        console.log({ user, url, token });
        const VerificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
            try{
      const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px;">
          <table width="600" style="background:#ffffff;border-radius:10px;padding:30px;">
            
            <tr>
              <td style="text-align:center;">
                <h2 style="color:#0f172a;">Verify your email address</h2>
              </td>
            </tr>

            <tr>
              <td style="color:#334155;font-size:14px;line-height:1.6;">
                <p>Hello <strong>MD Shihab Shamim</strong>,</p>
                <p>
                  Thanks for signing up to <strong>Prisma Blog</strong>.
                  Please verify your email address by clicking the button below.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px 0;">
                <a href="${VerificationUrl}"
                  style="background:#2563eb;color:#ffffff;
                          padding:12px 24px;
                          text-decoration:none;
                          font-weight:bold;
                          border-radius:6px;
                          display:inline-block;">
                  Verify Email
                </a>
              </td>
            </tr>

            <tr>
              <td style="font-size:12px;color:#64748b;">
                <p>This verification link will expire in 15 minutes.</p>
                <p>If you didn’t create an account, you can safely ignore this email.</p>
              </td>
            </tr>

            <tr>
              <td style="border-top:1px solid #e2e8f0;padding-top:15px;font-size:12px;color:#94a3b8;">
                <p>
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>
                <p style="word-break:break-all;">
                  <p style="color:#2563eb;">
                    ${url}
                  </p>
                </p>
                <p>© ${new Date().getFullYear()} Prisma Blog</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog.com>',
          to: user?.email,
          subject: "please verify your email",

          html: htmlTemplate, // HTML version of the message
        });
            }
            catch(err){
              console.log(err)
              throw err;
            }
      },
    
    },
      socialProviders: {
        google: { 
          prompt: "select_account consent", 
          accessType: "offline",  
           clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
           
        }, 
    },
  });

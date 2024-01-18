import { publicProcedure, router } from './trpc';
import { z } from 'zod'; 
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import jwt from 'jsonwebtoken';

const userInputType = z.object({
    email: z.string(),
    password: z.string(),
});

const USER: {email : string, password: string, token: string}[] = []


const appRouter = router({
  signup: publicProcedure
  .input(userInputType)
  .mutation(async (opts) => {
   // context
     let email = opts.input.email ;
   //   console.log(email);
     let password = opts.input.password;
   //   console.log(password);
    
     if(USER.find((user)=>user.email === email)){
        throw new Error("Email already exists");
     }
     if(USER.find((user)=>user.password === password)){
        throw new Error("Password already exists");
     }

     const token = jwt.sign({email, password}, "SECRET");
    //  console.log(token);
     USER.push({email, password, token});
     console.log(USER);
     return {
        USER,
        msg: "Signup Successfully"
     }
  }),

  login: publicProcedure
  .input(userInputType)
  .mutation(async (opts) => {
      let {email, password} = opts.input;
      return {
         email: email,
         password: password,
         msg: "Login Successfully"
      }
  })
});
 
const server = createHTTPServer({
    router: appRouter,
    createContext(opts){
      let authHeaders = opts.req.headers["authorization"];
      console.log("authHeaders", authHeaders);
      if(authHeaders){
        let token = authHeaders.split(" ")[1];
        console.log("token", token);
        return {
          userEmail: "prashantvarma@gami.com",
        }
      }else{
         return {
            userEmail: undefined,
         }
         
      }
    }
  });
   
server.listen(3001, () => {
    console.log('🚀 Server ready at http://localhost:3000');
});
export type AppRouter = typeof appRouter;
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';

let token: string = ""

const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3001',
        async headers() {
          return {
            authorization: `Bearer ${token}`,
          };
        }
      }),
    ],  
});

function login(){
  trpc.login.mutate({
    email: 'praash1@gmail.com',
    password: 'password1',
  }).then((res)=>{
    console.log(res);
  }).catch((err)=>{
    console.log(err.message);
  });
}


trpc.signup.mutate({
    email: 'praash1@gmail.com',
    password: 'password1',
}).then((res)=>{
    token = res.USER[0].token;
    console.log("token in client", token);
    login();
}).catch((err)=>{
    console.log(err.message);
});

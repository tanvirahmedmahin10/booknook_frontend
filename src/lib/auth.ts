import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URL as string);
const db = client.db('bookUsers');

export const auth = betterAuth({
   baseURL: process.env.BETTER_AUTH_URL, 
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
   emailAndPassword: { 
    enabled: true, 
  },
   plugins: [jwt()],
   session:{
    cookieCache:{
      enabled:true,
      strategy:'jwt',
      maxAge:7*24*60*60
    }
   },
  database: mongodbAdapter(db, {
    client,
  }),
});
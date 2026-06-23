
import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv"
dotenv.config()


// console.log(process.env.MAILTRAP_API_TOKEN)

export const client = new MailtrapClient({token: process.env.MAILTRAP_API_TOKEN!});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "patel stackbrother",
};
    
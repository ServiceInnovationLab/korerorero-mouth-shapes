import * as dotenv from "dotenv";
dotenv.config();
export const PORT = parseInt(String(process.env.PORT), 10);
export const rhubarbCmd = "./vendor/rhubarb-lip-sync/build/rhubarb/rhubarb ";

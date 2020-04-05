import * as dotenv from "dotenv";
import envalid, { bool, port } from "envalid"
dotenv.config();

const env = envalid.cleanEnv(process.env, {
  IS_DEV: bool(),
  PORT: port(),
});

export const PORT = parseInt(String(process.env.PORT), 10);
export const rhubarbCmd = "./vendor/rhubarb/rhubarb ";

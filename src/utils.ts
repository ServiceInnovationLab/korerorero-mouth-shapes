import * as dotenv from "dotenv";
import fs from "fs";
import envalid, { bool, port, makeValidator } from "envalid";
dotenv.config();

const validFilePath = makeValidator((envValue) => {
  if (fs.existsSync(envValue)) return envValue;
  else throw new Error("Expected a valid directory");
});
const env = envalid.cleanEnv(process.env, {
  IS_DEV: bool(),
  PORT: port(),
  TMP_DIR: validFilePath(),
});

export const PORT = parseInt(String(env.PORT), 10);
export const rhubarbCmd = "./vendor/rhubarb/rhubarb ";
export const tmpDir = env.TMP_DIR;

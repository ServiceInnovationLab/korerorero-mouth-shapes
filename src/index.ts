import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { exec } from "child_process";


dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

let rhubarbVersion: String;

exec("./vendor/rhubarb-lip-sync/build/rhubarb/rhubarb --version", (error, stdout, stderr) => {
  if (error) {
      console.log(`error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
  }
  rhubarbVersion = stdout;
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.get("/", function(_req, res) {
  res.send(rhubarbVersion);
});

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

type ModuleId = string | number;
interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

if (process.env.IS_DEV === "true" && module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}

// API: https://www.npmjs.com/package/passport-headerapikey

//API: location of file to analyse 
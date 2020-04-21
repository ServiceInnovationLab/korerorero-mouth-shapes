import express from "express";
import helmet from "helmet";
import { exec } from "child_process";
import { rhubarbCmd, PORT } from "./utils";
import getShapes, { getAudioById } from "./api/get-shapes";
import bodyParser from "body-parser";

const app = express();

let rhubarbVersion: String;

exec(rhubarbCmd + "--version", (error, stdout, stderr) => {
  if (error) {
    console.log(`❌ error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`❌ stderr: ${stderr}`);
    return;
  }
  rhubarbVersion = stdout;
});

app.use(helmet());
app.use(helmet.xssFilter());
app.disable("x-powered-by");
app.use(express.json());
app.use(bodyParser.json())

// ANCHOR / 
app.get("/", function (_req, res) {
  res.send("OK. " + rhubarbVersion);
});

// ANCHOR /process 
app.post("/process", async function (req, res) {
  const request = String(req.body.speech_url);
  if (!request) {
    res.sendStatus(500);
    return;
  }
  const results = await getShapes(request);
  if (!results.metadata.soundFile) {
    console.error(`❌ results.metadata.soundFile was returned falsy`);
    res.sendStatus(500);
    return;
  }
  console.info(`ℹ️ results.metadata.soundFile=${results.metadata.soundFile}`);
  res.set("Content-Type", "application/json");
  res.send(results);
});

// ANCHOR /audio?id=<audioId>

app.get("/audio", function (req, res) {
  const audioId = String(req.query.id);
  if (!audioId) {
    console.error(`❌ :audioId param is falsy`);
    res.sendStatus(500);
    return;
  }
  console.error(`ℹ️ Looking up ${audioId}`);
  res.set("Content-Type", "audio/wav");
  res.send(getAudioById(audioId));
});

const server = app.listen(PORT, () => {
  console.log(`ℹ️ Listening on port ${PORT}`);
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

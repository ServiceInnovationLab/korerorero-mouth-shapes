import express from "express";
import querystring from "querystring"
import helmet from "helmet";
import { exec } from "child_process";
import { rhubarbCmd, PORT } from "./utils";
import parseAudio, { getShapesById } from "./api/get-shapes";

const app = express();

let rhubarbVersion: String;

exec(rhubarbCmd + "--version", (error, stdout, stderr) => {
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
app.use(helmet.xssFilter());
app.disable('x-powered-by');
app.use(express.json());
app.get("/", function(_req, res) {
  res.send("OK. " + rhubarbVersion);
});

app.get("/process", async function(req, res) {
  const request = req.query.speech_url;
  if (!request) {
    res.sendStatus(500);
    return;
  }
  console.info(`ℹ️ Calling parseAudio(${request})`)
  const shapes = await parseAudio(request);
  if (!shapes.audioFileName) {
    console.error(`❌ shapes.audioFileName was returned falsy`)
    res.sendStatus(500);
    return;
  }
  console.info(`ℹ️ shapes.shapesID=${shapes.shapesID}`);
  console.info(`ℹ️ shapes.audioFileName=${shapes.audioFileName}`);
  res.set("Content-Type", "audio/wav");
  res.header({ link: `/shapes?shapes_id=${shapes.shapesID}` });
  res.sendFile(shapes.audioFileName);
});

app.get("/shapes", function (req, res) {
  const shapesId = req.query.shapes_id;
  res.set("Content-Type", "application/json");
  res.send(getShapesById(shapesId));
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
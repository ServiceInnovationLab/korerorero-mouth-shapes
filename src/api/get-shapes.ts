import axios from "axios";
import fs from "fs";
import tmp from "tmp";
import { rhubarbCmd, tmpDir } from "../utils";
import { exec } from "child_process";
import sanitize from "sanitize-filename";

const PREFIX_VOICE = "voice_";
const POSTFIX_VOICE = ".wav";
const PREFIX_SHAPES = "shapes_";
const POSTFIX_SHAPES = ".json";

interface AudioAndShapes {
  shapesFileName: string;
  audioFileName: string;
  audioId: string;
  valid: boolean;
}
interface MouthCues {
  start: number;
  end: number;
  value: string;
}
interface ResultJson {
  metadata: {
    soundFile: string;
    duration: number;
  };
  mouthCues: Array<MouthCues>;
}

const getAudioId = (path: string): string => {
  const pathParts: Array<string> = path.split("/");
  const fileName: string = pathParts[pathParts.length - 1];
  const fileNameParts: Array<string> = fileName.split(".");
  return fileNameParts[0];
};

const audioFilePath = (id: string): string => {
  return `${tmpDir}${sanitize(id)}${POSTFIX_VOICE}`;
};

const downloadAudio = async (request: string): Promise<string> => {
  const audioFileName = tmp.tmpNameSync({
    prefix: PREFIX_VOICE,
    postfix: POSTFIX_VOICE,
  });
  console.info(`ℹ️ Getting audio ${request}`);
  const response = await axios
    .get(request, { responseType: "arraybuffer" })
    .catch(function (error) {
      console.error(`❌ Error getting audio file: ${error.message}`);
    });
  if (response) {
    fs.writeFileSync(audioFileName, Buffer.from(response.data, "binary"));
    console.info(`✅ Wrote audio file ${audioFileName}`);
    return audioFileName;
  } else {
    console.error(`❌ Error writing audio file`);
    return "";
  }
};

export const parseAudio = async (request: string): Promise<AudioAndShapes> => {
  const audioFileName = await downloadAudio(request);
  const shapesFileName = tmp.tmpNameSync({
    prefix: PREFIX_SHAPES,
    postfix: POSTFIX_SHAPES,
  });
  const valid = audioFileName !== ""
  const results: AudioAndShapes = {
    audioFileName,
    shapesFileName: valid ? shapesFileName : "",
    audioId: getAudioId(audioFileName),
    valid,
  };
  if (!results.valid) {
    return results;
  }
  const cmd = `${rhubarbCmd} -r phonetic -f json -o ${results.shapesFileName} ${results.audioFileName}`;
  console.info(`ℹ️ Constructed command: ${cmd}`);
  return new Promise<AudioAndShapes>((resolve, reject) => {
    exec(cmd, (error, _stdout, _stderr) => {
      if (error) {
        const errorMessage = `❌ Rhubarb command returned error: ${error?.message}`;
        console.error(errorMessage);
        reject(errorMessage);
      }
      console.info(`✅ Rhubarb command executed successfully`);
      resolve(results);
    });
  });
};

export const getAudioById = (id: string): Buffer => {
  return fs.readFileSync(audioFilePath(id));
};

const parseAudioToJson = async (request: string): Promise<ResultJson> => {
  const result = await parseAudio(request);
  const json: ResultJson = JSON.parse(
    fs.readFileSync(result.shapesFileName).toString()
  );
  json.metadata.soundFile = "/audio/" + result.audioId;
  return json;
};

export default parseAudioToJson;

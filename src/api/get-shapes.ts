import axios from "axios";
import fs from "fs";
import tmp from "tmp";
import { rhubarbCmd, tmpDir } from "../utils";
import { exec } from "child_process";
import sanitize from "sanitize-filename"

const PREFIX_VOICE = "voice_";
const PREFIX_SHAPES = "shapes_"
const POSTFIX_VOICE = ".wav"
const POSTFIX_SHAPES = ".json"

interface AudioAndShapes {
  shapesFileName: string;
  audioFileName: string;
  shapesID: string;
  valid: boolean;
}

const shapesID = (path: string): string => {
  const pathParts: Array<string> = path.split("/");
  const fileName: string = pathParts[pathParts.length - 1];
  const fileNameParts: Array<string> = fileName.split(".");
  return fileNameParts[0];
};

const shapesFilePath = (id: string): string => {  
  return `${tmpDir}${sanitize(id)}${POSTFIX_SHAPES}`
}

const downloadAudio = async (request: string): Promise<string | boolean> => {
  const audioFileName = tmp.tmpNameSync({ prefix: PREFIX_VOICE, postfix: POSTFIX_VOICE });
  const response = await axios
    .get(request, { responseType: "arraybuffer" })
    .catch(function(error) {
      console.log("Error", error.message);
    });
  if (response) {
    fs.writeFileSync(audioFileName, Buffer.from(response.data, "binary"));
    return audioFileName;
  } else {
    return false;
  }
};

const parseAudio = async (request: string): Promise<AudioAndShapes> => {
  const audioFileName = await downloadAudio(request);
  const shapesFileName = tmp.tmpNameSync({
    prefix: PREFIX_SHAPES,
    postfix: POSTFIX_SHAPES
  });
  const fileNames: AudioAndShapes = {
    audioFileName: String(audioFileName),
    shapesFileName: audioFileName ? shapesFileName : String(false),
    shapesID: shapesID(shapesFileName),
    valid: audioFileName ? true : false
  };
  if (!fileNames.valid) {
    return fileNames;
  }
  const cmd = `${rhubarbCmd} -r phonetic -f json -o ${fileNames.shapesFileName} ${fileNames.audioFileName}`;
  console.info(`cmd: ${cmd}`);
  return new Promise<AudioAndShapes>((resolve, reject) => {
    exec(cmd, (error, _stdout, _stderr) => {
      if (error) {
        reject(`rhubarbCmd error: ${error?.message}`);
      }
      resolve(fileNames);
    });
  });
};

export const getShapesById = (id: string):Buffer => {
  return fs.readFileSync(shapesFilePath(id));
}

export default parseAudio

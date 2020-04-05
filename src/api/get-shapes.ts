import axios from "axios";
import fs from "fs";
import tmp from "tmp";
import { rhubarbCmd } from "../utils";
import { exec } from "child_process";

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

const downloadAudio = async (request: string): Promise<string | boolean> => {
  const audioFileName = tmp.tmpNameSync({ prefix: "voice_", postfix: ".wav" });
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

const getShapes = async (request: string): Promise<AudioAndShapes> => {
  const audioFileName = await downloadAudio(request);
  const shapesFileName = tmp.tmpNameSync({
    prefix: "shapes_",
    postfix: ".txt"
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

export default getShapes;

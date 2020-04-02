import axios from "axios";
import fs from "fs";
import tmp from "tmp";
import { rhubarbCmd } from "../utils";
import { exec } from "child_process";

interface AudioAndShapes {
  shapesFileName: string;
  audioFileName: string;
}

const downloadAudio = async (request: string) => {
  const tmpFile = tmp.tmpNameSync();
  const shapesFileName = tmpFile + ".txt";
  const audioFileName = tmpFile + ".wav";
  const response = await axios.get(request, { responseType: "arraybuffer" });
  console.info(`Got URL: ${request}`)
  fs.writeFileSync(audioFileName, Buffer.from(response.data, "binary"));
  console.info(`Wrote file: ${audioFileName}`)
  return { audioFileName, shapesFileName };
};

const getShapes = async (request: string) => {
  const fileNames = await downloadAudio(request);
  const cmd = `${rhubarbCmd} -r phonetic -f json -o ${fileNames.shapesFileName} ${fileNames.audioFileName}`;
  console.info(`cmd: ${cmd}`)
  return new Promise<AudioAndShapes>((resolve, reject) => {
    exec(cmd, (error, _stdout, _stderr) => {
      if (error) {
        reject(`rhubarbCmd error: ${error?.message}`);
      }
      console.info(`Ran cmd`)
      resolve(fileNames);
    });
  });
};

export default getShapes;

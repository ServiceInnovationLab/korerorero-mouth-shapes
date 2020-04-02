import axios from "axios";
import fs from "fs";
import tmp from "tmp";
import { rhubarbCmd } from "../utils";
import { exec } from "child_process";

const request = "http://localhost:3001/process.wav";

const downloadAudio = async () => {
  const tmpFile = tmp.tmpNameSync();
  const shapesFileName = tmpFile + ".txt";
  const audioFileName = tmpFile + ".wav";
  const response = await axios.get(request, { responseType: "arraybuffer" });
  fs.writeFileSync(audioFileName, Buffer.from(response.data, "binary"));
  return { audioFileName, shapesFileName };
};

const reply = async () => {
  const fileNames = await downloadAudio();
  const cmd = `${rhubarbCmd} -o ${fileNames.shapesFileName} ${fileNames.audioFileName}`;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, _stdout, _stderr) => {
      if (error) {
        reject(`rhubarbCmd error: ${error?.message}`);
      }
      resolve(fileNames);
    });
  });
};

export default reply;

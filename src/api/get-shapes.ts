import axios from "axios";
import fs from "fs";
import tmp from "tmp";
// import { rhubarbCmd } from "../utils";

const request = "http://tts:59125/process?INPUT_TYPE=TEXT&AUDIO=WAVE_FILE&OUTPUT_TYPE=AUDIO&LOCALE=en_US&INPUT_TEXT=hello%20world"

const reply = async () => {
  const audioFileName = tmp.tmpNameSync();
  const response = await axios.get(request); 
  fs.writeFileSync(audioFileName, response.data);
  return audioFileName;
};

export default reply;

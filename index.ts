import express from "express";
import multer from "multer"
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

ffmpeg.setFfmpegPath(ffmpegPath);

const PORT = 5000;
const app = express();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "./tmp/");
  },
  filename: (request, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

app.use(multer({ storage }).single("file"));

app.get('/ola', (request, response) => {
  return response.send('ola')
})

app.post("/convert", async (request, response) => {
  console.log('caiu AQUI')
  const file = request.file as Express.Multer.File;
  const fileName = "-output.mp3";

  const audio = await ffmpeg("tmp/" + file.filename)
    .toFormat("mp3")
    .saveToFile("audio/" + file.filename.replace('.mp4', fileName));
    return response.send(audio)
});

function removeFile(directory:any) {
  fs.unlink(directory, (error:any) => {
    if (error) throw error;
    console.log("File deleted");
  });
}

app.listen(PORT, () => { console.log('server running on PORT', PORT);
 });
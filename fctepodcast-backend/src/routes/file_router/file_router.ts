import express from "express";
import fs from "fs";

const file_router = express.Router();

file_router.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "File router is running",
  });
});

file_router.get("/audio/:file_path", (req, res) => {
  const range = req.headers.range;
  const filePath = req.params.file_path;
  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }

  const audioSize = fs.statSync(filePath).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, audioSize - 1);

  const contentLength = end - start + 1;
  const audioStream = fs.createReadStream(filePath, {
    start,
    end,
  });

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${audioSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mpeg",
  });

  audioStream.pipe(res);
});

export default file_router;

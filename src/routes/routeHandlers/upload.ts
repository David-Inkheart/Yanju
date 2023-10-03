import { Metadata } from '@grpc/grpc-js';
import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import client from '../../services/grpcUploadClient/client';

const uploadFileHandler: RequestHandler = async (req, res) => {
  let result;
  try {
    if (req.busboy) {
      let fileUploaded = false;
      req.busboy.on('file', (name, file, info) => {
        // save locally
        fileUploaded = true;
        const folderPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
        }
        const filePath = path.join(folderPath, info.filename);
        const writeStream = fs.createWriteStream(filePath);

        file.pipe(writeStream);

        writeStream.on('close', async () => {
          // create a stream to read the file

          // send file to grpc server
          const metadata = new Metadata();
          metadata.set('fileName', info.filename);

          const call = client.UploadFileWithStream(metadata, (err, response) => {
            if (err) {
              result = res.status(500).json({
                success: false,
                message: err.message,
              });
            } else {
              result = res.status(200).json({
                success: true,
                message: response?.message,
              });
            }
          });

          const fileContent = fs.createReadStream(filePath);
          fileContent.on('data', (chunk) => {
            call.write({ fileContent: chunk });
          });

          fileContent.on('end', () => {
            call.end();
          });
        });
      });
      req.busboy.on('finish', () => {
        if (!fileUploaded) {
          result = res.status(400).json({
            success: false,
            message: 'No file uploaded',
          });
        }
      });
      req.pipe(req.busboy);
    }
  } catch (error: any) {
    result = res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  return result;
};

export default uploadFileHandler;

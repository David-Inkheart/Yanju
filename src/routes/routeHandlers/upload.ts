import { Metadata } from '@grpc/grpc-js';
import { RequestHandler } from 'express';
import fs from 'fs';
import client from '../../services/grpcUploadClient/client';

const uploadFileHandler: RequestHandler = async (req, res) => {
  let result;
  try {
    if (req.busboy) {
      // let fileUploaded = false;
      req.busboy.on('file', (name, file, info) => {
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

        // file.pipe(call);
        file.on('data', (data) => {
          call.write({ fileContent: data });
        });

        file.on('end', () => {
          call.end();
        });
      });
      req.busboy.on('finish', () => {
        console.log('file upload finished');
      });
      // req.pipe(req.busboy);
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

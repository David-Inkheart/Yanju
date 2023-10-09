import { RequestHandler } from 'express';
import formidable from 'formidable';
// import { Readable, Writable, Duplex, PassThrough, Pipe, Transform } from 'node:stream';
import fs from 'fs';
import { Metadata } from '@grpc/grpc-js';
import path from 'path';
import { PassThrough, Readable } from 'stream';
import client from '../../services/grpcUploadClient/client';

function streamUploadFile(file: any) {
  const pass = new PassThrough();
  const metadata = new Metadata();
  metadata.set('fileName', file.originalFilename);

  const call = client.uploadFileWithStream(metadata, (err, res) => {
    if (err) {
      return err;
    }
    return res;
  });

  pass.on('data', (chunk: string) => {
    call.write({ fileContent: chunk });
  });

  pass.on('end', () => {
    call.end();
  });

  // create a read stream from the file
  // const readStream = new Readable(file);

  // pipe the read stream to the pass through stream
  // readStream.read().pipe(
  //   pass.on('data', (chunk) => {
  //     call.write({ fileContent: chunk });
  //   }),
  // );

  return pass;
}

const uploadFileHandler: RequestHandler = (req, res) => {
  try {
    // create filepath
    const folderPath = path.join(__dirname, '../../uploads');

    // if (!fs.existsSync(folderPath)) {
    //   fs.mkdirSync(folderPath);
    // }

    // create a new form object
    const form = formidable({
      multiples: false,
      uploadDir: folderPath,
      keepExtensions: true,
      allowEmptyFiles: false,
      fileWriteStreamHandler: streamUploadFile,
    });

    // parse the form data
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          success: false,
          message: 'Error parsing form data',
        });
        return;
      }

      console.log('files:', files);

      // uploaded files logic goes here

      // For example, move them to a specific folder or perform further actions

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
      });
    });

    form.once('error', (err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Error parsing form data',
      });
    });

    form.once('end', () => {
      console.log('Done!');
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export default uploadFileHandler;

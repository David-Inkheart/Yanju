import { RequestHandler } from 'express';
import formidable from 'formidable';
import { Metadata } from '@grpc/grpc-js';
import path from 'path';
import { PassThrough } from 'stream';
import client from '../../services/grpcUploadClient/client';

function streamUploadFile(file: any) {
  const pass = new PassThrough();
  const metadata = new Metadata();
  metadata.set('fileName', file.originalFilename);

  const call = client.uploadFileWithStream(metadata, (err, res) => {
    if (err) {
      return err;
    }
    console.log('client has started streaming');
    return res;
  });

  pass.on('data', (chunk: string) => {
    call.write({ fileContent: chunk });
    console.log('fileContent: ', chunk);
  });

  pass.on('end', () => {
    call.end();
  });

  return pass;
}

const uploadFileHandler: RequestHandler = (req, res) => {
  try {
    // create filepath
    const folderPath = path.join(__dirname, '../../uploads');

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
        console.log('formidable has ended parsing form data');
        return;
      }

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
      console.log('formidable is done with file upload!');
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

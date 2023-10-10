import { Metadata } from '@grpc/grpc-js';
import { RequestHandler } from 'express';
import { uploadClient, downloadClient } from '../../services/grpcUploadClient/client';
import { downloadSchema } from '../../utils/validators';

const uploadFileHandler: RequestHandler = async (req, res) => {
  let result;
  try {
    if (req.busboy) {
      let fileUploaded = false;
      req.busboy.on('file', (name, file, info) => {
        fileUploaded = true;
        console.log(`File [${info.filename}] started streaming to server...`);
        const metadata = new Metadata();
        metadata.add('fileName', info.filename);
        const call = uploadClient.UploadFileWithStream(metadata, (err, response) => {
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

        file.on('data', (data) => {
          call.write({ fileContent: data });
        });

        file.on('end', () => {
          call.end();
          console.log('File streaming finished');
        });
      });
      req.busboy.on('finish', () => {
        if (!fileUploaded) {
          result = res.status(500).json({
            success: false,
            message: 'No file uploaded',
          });
        }
        console.log('file upload finished');
      });
    }
    // req.pipe(req.busboy);
  } catch (error: any) {
    result = res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  return result;
};

const downloadFileHandler: RequestHandler = async (req, res) => {
  try {
    const { fileName } = req.params;
    const { error } = downloadSchema.validate({ fileName });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // downloadClient
    //   .DownloadFileWithStream({ fileName })
    //   .on('error', (err: Error) => {
    //     console.log('error streaming from server: ', err);
    //     if (err.message.includes('NOT_FOUND') || err.message.includes('INVALID_ARGUMENT')) {
    //       return res.status(404).json({
    //         success: false,
    //         message: err.message,
    //       });
    //     }
    //     return res.status(500).json({
    //       success: false,
    //       message: err.message,
    //     });
    //   })
    //   .on('data', (chunk) => {
    //     console.log('chunk received: ', chunk);
    //     res.write(chunk.fileContent);
    //   })
    //   .on('end', () => {
    //     res.end();
    //     console.log('finished streaming from server');
    //   });

    const call = downloadClient.DownloadFileWithStream({ fileName });
    console.log('started streaming from server...');

    call.on('error', (err: Error) => {
      console.log('error streaming from server: ', err);
      if (err.message.includes('NOT_FOUND') || err.message.includes('INVALID_ARGUMENT')) {
        res.status(404).json({
          success: false,
          message: err.message,
        });
      }
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });

    call.on('data', (chunk) => {
      console.log('chunk received: ', chunk);
      res.write(chunk.fileContent);
    });

    call.on('end', () => {
      res.end();
      console.log('finished streaming from server');
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'internal server error',
    });
  }
  return null;
};

export { uploadFileHandler, downloadFileHandler };

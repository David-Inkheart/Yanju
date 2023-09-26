import { RequestHandler } from 'express';
import client from '../../services/grpcUploadClient/client';

const uploadFileHandler: RequestHandler = async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded',
    });
  }

  const fileBuffer = Buffer.from(file.buffer);
  const result = client.uploadFile({ fileName: file.originalname, fileContent: fileBuffer }, (err, response) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        error: 'Something went wrong',
      });
    }
    return res.status(200).json({
      success: true,
      data: response,
    });
  });

  return result;
};

export default uploadFileHandler;

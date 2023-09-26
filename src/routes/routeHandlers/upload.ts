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

  let result;
  try {
    const fileBuffer = Buffer.from(file.buffer);
    result = client.uploadFile({ fileName: file.originalname, fileContent: fileBuffer }, (err, response) => {
      return res.status(200).json({
        success: true,
        data: response,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong',
    });
  }
  return result;
};

export default uploadFileHandler;

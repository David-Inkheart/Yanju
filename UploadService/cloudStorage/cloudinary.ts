import { v2 as cloudinary } from 'cloudinary';
import { configDotenv } from 'dotenv';

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadFile = async (file: any) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      public_id: file.originalname,
      unique_filename: true,
      use_filename: true,
      overwrite: true,
    });
    return result.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

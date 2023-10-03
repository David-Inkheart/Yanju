import path from 'path';
import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/upload';
import { uploadFile } from './cloudStorage/cloudinary';
import { UploadHandlers } from './proto/uploadPackage/Upload';

const PORT = 50051;
const PROTO_PATH = path.resolve(__dirname, 'proto/upload.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;

const { uploadPackage } = grpcObj;

async function handleUploadFile(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  try {
    const { fileName, fileContent } = call.request;
    // save file locally
    if (!fs.existsSync(path.resolve(__dirname, 'uploads'))) {
      fs.mkdirSync(path.resolve(__dirname, 'uploads'));
    }
    const filePath = path.resolve(__dirname, 'uploads', fileName);
    fs.writeFile(filePath, fileContent, (err: any) => {
      if (err) {
        callback(err, null);
      }
    });
    const localUploadMessage = `File **${fileName}** uploaded locally. Size: ${fileContent.length} bytes`;
    console.log(localUploadMessage);

    callback(null, { message: localUploadMessage });

    // send file to cloudinary
    const fileUrl = await uploadFile(filePath);
    if (!fileUrl) {
      callback(new Error('Error uploading file'), null);
    }
    console.log(fileUrl);
    const responseMessage = `File ${fileName} uploaded successfully. Size: ${fileContent.length} bytes. Url: ${fileUrl}`;
    callback(null, { message: responseMessage });
  } catch (error: any) {
    callback(error, null);
  }
}

async function handleUploadFileWithStream(call: grpc.ServerReadableStream<any, any>, callback: grpc.sendUnaryData<any>) {
  let result: any;
  try {
    // get the stream from the client
    const fileName = String(call.metadata.get('fileName'));

    if (!fileName) {
      result = callback({ code: grpc.status.INVALID_ARGUMENT, message: 'Invalid metadata' }, null);
    }

    const folderPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    const filePath = path.join(folderPath, fileName);
    console.log(filePath);

    // fetch the file from the stream and save it locally

    call.on('data', (chunk) => {
      fs.appendFileSync(filePath, chunk.fileContent);
    });

    call.on('end', async () => {
      const localUploadMessage = `File **${fileName}** uploaded locally.`;
      console.log(localUploadMessage);
      result = callback(null, { message: localUploadMessage });
      // const fileUrl = await uploadFile(filePath);
      // if (!fileUrl) {
      //   result = callback(new Error('Error uploading file'), null);
      // }
      // console.log(fileUrl);
      // const responseMessage = `File ${fileName} uploaded successfully. Url: ${fileUrl}`;
      // result = callback(null, { message: responseMessage });
    });

    // call.on('error', (err) => {
    //   result = callback(err, null);
    // });
  } catch (error: any) {
    callback(error, null);
  }

  return result;
}

function createServer() {
  const server = new grpc.Server();
  server.addService(uploadPackage.Upload.service, {
    UploadFile: handleUploadFile,
    UploadFileWithStream: handleUploadFileWithStream,
  } as UploadHandlers);
  return server;
}

function startServer(server: grpc.Server, port: string) {
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      console.error(err);
      return;
    }
    server.start();
    console.log(`Server running on port ${boundPort}`);
  });
}

function main() {
  const server = createServer();
  startServer(server, String(PORT));
}

main();

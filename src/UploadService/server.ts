import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { ProtoGrpcType } from '../proto/generated/upload';
import { UploadHandlers } from '../proto/generated/UploadAndDownloadPackage/Upload';
import { uploadFile } from './cloudStorage/cloudinary';
import { DownloadHandlers } from '../proto/generated/UploadAndDownloadPackage/Download';

const PORT = 50051;
const PROTO_PATH = 'upload.proto';

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;

const { UploadAndDownloadPackage } = grpcObj;

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

    const fileName = `${randomUUID()}-${call.metadata.get('fileName')}`;

    if (!fileName) {
      result = callback({ code: grpc.status.INVALID_ARGUMENT, message: 'Invalid metadata' }, null);
    }

    const folderPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    const filePath = path.join(folderPath, fileName);

    // fetch the file from the stream and save it locally
    call.on('data', (chunk) => {
      fs.appendFileSync(filePath, chunk.fileContent);
      console.log('chunk received: ', chunk.fileContent);
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

async function handleDownloadFileWithStream(call: grpc.ServerWritableStream<any, any>) {
  try {
    const { fileName } = call.request;
    if (!fileName) {
      call.emit('error', {
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Invalid fileName',
      });
      return;
    }
    const filePath = path.resolve(__dirname, 'uploads', fileName);

    if (!fs.existsSync(filePath)) {
      call.emit('error', {
        code: grpc.status.NOT_FOUND,
        message: 'File not found',
      });
      return;
    }

    const readContent = fs.createReadStream(filePath);
    console.log('started streaming from file to client...');

    readContent.on('data', (chunk) => {
      call.write({ fileContent: chunk });
      console.log('chunk sent: ', chunk);
    });

    readContent.on('end', () => {
      call.end();
      console.log('streaming to client finished');
    });
  } catch (error: any) {
    console.log(error);
    call.emit('error', {
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
}

function createServer() {
  const server = new grpc.Server();
  server.addService(UploadAndDownloadPackage.Upload.service, {
    UploadFile: handleUploadFile,
    UploadFileWithStream: handleUploadFileWithStream,
  } as UploadHandlers);
  server.addService(UploadAndDownloadPackage.Download.service, {
    DownloadFileWithStream: handleDownloadFileWithStream,
  } as DownloadHandlers);
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

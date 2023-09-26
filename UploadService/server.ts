import path from 'path';
import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/upload';
import { UploadHandlers } from './proto/uploadPackage/Upload';

const PORT = 50051;
const PROTO_PATH = path.resolve(__dirname, 'proto/upload.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;

const { uploadPackage } = grpcObj;

function handleUploadFile(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const { fileName, fileContent } = call.request;

  if (!fs.existsSync(path.resolve(__dirname, 'uploads'))) {
    fs.mkdirSync(path.resolve(__dirname, 'uploads'));
  }
  const filePath = path.resolve(__dirname, 'uploads', fileName);
  fs.writeFileSync(filePath, fileContent);
  const responseMessage = `File "${fileName}" uploaded successfully. Size: ${fileContent.length} bytes`;
  // console.log(responseMessage);
  callback(null, { message: responseMessage });
}

function createServer() {
  const server = new grpc.Server();
  server.addService(uploadPackage.Upload.service, {
    UploadFile: handleUploadFile,
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
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../../proto/generated/upload';

const PORT = 50051;
const PROTO_PATH = 'upload.proto';

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;
const { UploadAndDownloadPackage } = grpcObj;

const uploadClient = new UploadAndDownloadPackage.Upload(`0.0.0.0:${PORT}`, grpc.credentials.createInsecure(), {
  'grpc.max_receive_message_length': 1024 * 1024 * 200, // 200MB
});

const downloadClient = new UploadAndDownloadPackage.Download(`0.0.0.0:${PORT}`, grpc.credentials.createInsecure(), {
  'grpc.max_receive_message_length': 1024 * 1024 * 200, // 200MB
});

export { uploadClient, downloadClient };

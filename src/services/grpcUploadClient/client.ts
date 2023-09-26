import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/upload';

const PORT = 50051;
const PROTO_PATH = path.resolve(__dirname, 'proto/upload.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;

const { uploadPackage } = grpcObj;

const client = new uploadPackage.Upload(`0.0.0.0:${PORT}`, grpc.credentials.createInsecure());

export default client;

// Original file: proto/upload.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { UploadLargeRequest as _uploadPackage_UploadLargeRequest, UploadLargeRequest__Output as _uploadPackage_UploadLargeRequest__Output } from '../uploadPackage/UploadLargeRequest';
import type { UploadRequest as _uploadPackage_UploadRequest, UploadRequest__Output as _uploadPackage_UploadRequest__Output } from '../uploadPackage/UploadRequest';
import type { UploadResponse as _uploadPackage_UploadResponse, UploadResponse__Output as _uploadPackage_UploadResponse__Output } from '../uploadPackage/UploadResponse';

export interface UploadClient extends grpc.Client {
  UploadFile(argument: _uploadPackage_UploadRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  UploadFile(argument: _uploadPackage_UploadRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  UploadFile(argument: _uploadPackage_UploadRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  UploadFile(argument: _uploadPackage_UploadRequest, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  uploadFile(argument: _uploadPackage_UploadRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  uploadFile(argument: _uploadPackage_UploadRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  uploadFile(argument: _uploadPackage_UploadRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  uploadFile(argument: _uploadPackage_UploadRequest, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  
  UploadFileWithStream(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientWritableStream<_uploadPackage_UploadLargeRequest>;
  UploadFileWithStream(metadata: grpc.Metadata, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientWritableStream<_uploadPackage_UploadLargeRequest>;
  UploadFileWithStream(options: grpc.CallOptions, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientWritableStream<_uploadPackage_UploadLargeRequest>;
  UploadFileWithStream(callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientWritableStream<_uploadPackage_UploadLargeRequest>;
  uploadFileWithStream(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientWritableStream<_uploadPackage_UploadLargeRequest>;
  uploadFileWithStream(metadata: grpc.Metadata, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientWritableStream<_uploadPackage_UploadLargeRequest>;
  uploadFileWithStream(options: grpc.CallOptions, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientWritableStream<_uploadPackage_UploadLargeRequest>;
  uploadFileWithStream(callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientWritableStream<_uploadPackage_UploadLargeRequest>;
  
}

export interface UploadHandlers extends grpc.UntypedServiceImplementation {
  UploadFile: grpc.handleUnaryCall<_uploadPackage_UploadRequest__Output, _uploadPackage_UploadResponse>;
  
  UploadFileWithStream: grpc.handleClientStreamingCall<_uploadPackage_UploadLargeRequest__Output, _uploadPackage_UploadResponse>;
  
}

export interface UploadDefinition extends grpc.ServiceDefinition {
  UploadFile: MethodDefinition<_uploadPackage_UploadRequest, _uploadPackage_UploadResponse, _uploadPackage_UploadRequest__Output, _uploadPackage_UploadResponse__Output>
  UploadFileWithStream: MethodDefinition<_uploadPackage_UploadLargeRequest, _uploadPackage_UploadResponse, _uploadPackage_UploadLargeRequest__Output, _uploadPackage_UploadResponse__Output>
}

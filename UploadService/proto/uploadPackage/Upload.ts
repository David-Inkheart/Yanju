// Original file: proto/upload.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type { UploadRequest as _uploadPackage_UploadRequest, UploadRequest__Output as _uploadPackage_UploadRequest__Output } from './UploadRequest';
import type {
  UploadResponse as _uploadPackage_UploadResponse,
  UploadResponse__Output as _uploadPackage_UploadResponse__Output,
} from './UploadResponse';

export interface UploadClient extends grpc.Client {
  UploadFile(
    argument: _uploadPackage_UploadRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  UploadFile(
    argument: _uploadPackage_UploadRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  UploadFile(
    argument: _uploadPackage_UploadRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  UploadFile(argument: _uploadPackage_UploadRequest, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
  uploadFile(
    argument: _uploadPackage_UploadRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  uploadFile(
    argument: _uploadPackage_UploadRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  uploadFile(
    argument: _uploadPackage_UploadRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  uploadFile(argument: _uploadPackage_UploadRequest, callback: grpc.requestCallback<_uploadPackage_UploadResponse__Output>): grpc.ClientUnaryCall;
}

export interface UploadHandlers extends grpc.UntypedServiceImplementation {
  UploadFile: grpc.handleUnaryCall<_uploadPackage_UploadRequest__Output, _uploadPackage_UploadResponse>;
}

export interface UploadDefinition extends grpc.ServiceDefinition {
  UploadFile: MethodDefinition<
    _uploadPackage_UploadRequest,
    _uploadPackage_UploadResponse,
    _uploadPackage_UploadRequest__Output,
    _uploadPackage_UploadResponse__Output
  >;
}

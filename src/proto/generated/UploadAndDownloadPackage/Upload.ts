// Original file: upload.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  UploadLargeRequest as _UploadAndDownloadPackage_UploadLargeRequest,
  UploadLargeRequest__Output as _UploadAndDownloadPackage_UploadLargeRequest__Output,
} from './UploadLargeRequest';
import type {
  UploadRequest as _UploadAndDownloadPackage_UploadRequest,
  UploadRequest__Output as _UploadAndDownloadPackage_UploadRequest__Output,
} from './UploadRequest';
import type {
  UploadResponse as _UploadAndDownloadPackage_UploadResponse,
  UploadResponse__Output as _UploadAndDownloadPackage_UploadResponse__Output,
} from './UploadResponse';

export interface UploadClient extends grpc.Client {
  UploadFile(
    argument: _UploadAndDownloadPackage_UploadRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  UploadFile(
    argument: _UploadAndDownloadPackage_UploadRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  UploadFile(
    argument: _UploadAndDownloadPackage_UploadRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  UploadFile(
    argument: _UploadAndDownloadPackage_UploadRequest,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  uploadFile(
    argument: _UploadAndDownloadPackage_UploadRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  uploadFile(
    argument: _UploadAndDownloadPackage_UploadRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  uploadFile(
    argument: _UploadAndDownloadPackage_UploadRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;
  uploadFile(
    argument: _UploadAndDownloadPackage_UploadRequest,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientUnaryCall;

  UploadFileWithStream(
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientWritableStream<_UploadAndDownloadPackage_UploadLargeRequest>;
  UploadFileWithStream(
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientWritableStream<_UploadAndDownloadPackage_UploadLargeRequest>;
  UploadFileWithStream(
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientWritableStream<_UploadAndDownloadPackage_UploadLargeRequest>;
  UploadFileWithStream(
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientWritableStream<_UploadAndDownloadPackage_UploadLargeRequest>;
  uploadFileWithStream(
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientWritableStream<_UploadAndDownloadPackage_UploadLargeRequest>;
  uploadFileWithStream(
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientWritableStream<_UploadAndDownloadPackage_UploadLargeRequest>;
  uploadFileWithStream(
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientWritableStream<_UploadAndDownloadPackage_UploadLargeRequest>;
  uploadFileWithStream(
    callback: grpc.requestCallback<_UploadAndDownloadPackage_UploadResponse__Output>,
  ): grpc.ClientWritableStream<_UploadAndDownloadPackage_UploadLargeRequest>;
}

export interface UploadHandlers extends grpc.UntypedServiceImplementation {
  UploadFile: grpc.handleUnaryCall<_UploadAndDownloadPackage_UploadRequest__Output, _UploadAndDownloadPackage_UploadResponse>;

  UploadFileWithStream: grpc.handleClientStreamingCall<
    _UploadAndDownloadPackage_UploadLargeRequest__Output,
    _UploadAndDownloadPackage_UploadResponse
  >;
}

export interface UploadDefinition extends grpc.ServiceDefinition {
  UploadFile: MethodDefinition<
    _UploadAndDownloadPackage_UploadRequest,
    _UploadAndDownloadPackage_UploadResponse,
    _UploadAndDownloadPackage_UploadRequest__Output,
    _UploadAndDownloadPackage_UploadResponse__Output
  >;
  UploadFileWithStream: MethodDefinition<
    _UploadAndDownloadPackage_UploadLargeRequest,
    _UploadAndDownloadPackage_UploadResponse,
    _UploadAndDownloadPackage_UploadLargeRequest__Output,
    _UploadAndDownloadPackage_UploadResponse__Output
  >;
}

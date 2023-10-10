// Original file: upload.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  DownloadRequest as _UploadAndDownloadPackage_DownloadRequest,
  DownloadRequest__Output as _UploadAndDownloadPackage_DownloadRequest__Output,
} from './DownloadRequest';
import type {
  DownloadResponse as _UploadAndDownloadPackage_DownloadResponse,
  DownloadResponse__Output as _UploadAndDownloadPackage_DownloadResponse__Output,
} from './DownloadResponse';

export interface DownloadClient extends grpc.Client {
  DownloadFileWithStream(
    argument: _UploadAndDownloadPackage_DownloadRequest,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions,
  ): grpc.ClientReadableStream<_UploadAndDownloadPackage_DownloadResponse__Output>;
  DownloadFileWithStream(
    argument: _UploadAndDownloadPackage_DownloadRequest,
    options?: grpc.CallOptions,
  ): grpc.ClientReadableStream<_UploadAndDownloadPackage_DownloadResponse__Output>;
  downloadFileWithStream(
    argument: _UploadAndDownloadPackage_DownloadRequest,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions,
  ): grpc.ClientReadableStream<_UploadAndDownloadPackage_DownloadResponse__Output>;
  downloadFileWithStream(
    argument: _UploadAndDownloadPackage_DownloadRequest,
    options?: grpc.CallOptions,
  ): grpc.ClientReadableStream<_UploadAndDownloadPackage_DownloadResponse__Output>;
}

export interface DownloadHandlers extends grpc.UntypedServiceImplementation {
  DownloadFileWithStream: grpc.handleServerStreamingCall<
    _UploadAndDownloadPackage_DownloadRequest__Output,
    _UploadAndDownloadPackage_DownloadResponse
  >;
}

export interface DownloadDefinition extends grpc.ServiceDefinition {
  DownloadFileWithStream: MethodDefinition<
    _UploadAndDownloadPackage_DownloadRequest,
    _UploadAndDownloadPackage_DownloadResponse,
    _UploadAndDownloadPackage_DownloadRequest__Output,
    _UploadAndDownloadPackage_DownloadResponse__Output
  >;
}

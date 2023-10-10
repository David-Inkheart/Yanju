import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  DownloadClient as _UploadAndDownloadPackage_DownloadClient,
  DownloadDefinition as _UploadAndDownloadPackage_DownloadDefinition,
} from './UploadAndDownloadPackage/Download';
import type {
  UploadClient as _UploadAndDownloadPackage_UploadClient,
  UploadDefinition as _UploadAndDownloadPackage_UploadDefinition,
} from './UploadAndDownloadPackage/Upload';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  UploadAndDownloadPackage: {
    Download: SubtypeConstructor<typeof grpc.Client, _UploadAndDownloadPackage_DownloadClient> & {
      service: _UploadAndDownloadPackage_DownloadDefinition;
    };
    DownloadRequest: MessageTypeDefinition;
    DownloadResponse: MessageTypeDefinition;
    Upload: SubtypeConstructor<typeof grpc.Client, _UploadAndDownloadPackage_UploadClient> & { service: _UploadAndDownloadPackage_UploadDefinition };
    UploadLargeRequest: MessageTypeDefinition;
    UploadRequest: MessageTypeDefinition;
    UploadResponse: MessageTypeDefinition;
  };
}

import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { UploadClient as _uploadPackage_UploadClient, UploadDefinition as _uploadPackage_UploadDefinition } from './uploadPackage/Upload';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  uploadPackage: {
    Upload: SubtypeConstructor<typeof grpc.Client, _uploadPackage_UploadClient> & { service: _uploadPackage_UploadDefinition };
    UploadLargeRequest: MessageTypeDefinition;
    UploadRequest: MessageTypeDefinition;
    UploadResponse: MessageTypeDefinition;
  };
}

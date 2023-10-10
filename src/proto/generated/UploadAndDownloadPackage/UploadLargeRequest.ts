// Original file: upload.proto


export interface UploadLargeRequest {
  'fileName'?: (string);
  'fileContent'?: (Buffer | Uint8Array | string);
}

export interface UploadLargeRequest__Output {
  'fileName'?: (string);
  'fileContent'?: (Buffer);
}

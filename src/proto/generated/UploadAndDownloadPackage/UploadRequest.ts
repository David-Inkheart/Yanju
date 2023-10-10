// Original file: upload.proto


export interface UploadRequest {
  'fileName'?: (string);
  'fileContent'?: (Buffer | Uint8Array | string);
}

export interface UploadRequest__Output {
  'fileName'?: (string);
  'fileContent'?: (Buffer);
}

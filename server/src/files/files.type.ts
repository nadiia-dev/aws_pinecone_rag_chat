export type Document = {
  id: number;
  userEmail: string;
  filename: string;
  objectKey: string;
  s3Url: string;
  uploadedAt: Date;
};

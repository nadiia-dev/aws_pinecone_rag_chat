export type DocumentStatusType = 'PENDING' | 'SUCCESS' | 'ERROR';

export type FileType = {
  id: string;
  userEmail: string;
  fileName: string;
  s3Key: string;
  status?: DocumentStatusType;
  createdAt?: Date;
};

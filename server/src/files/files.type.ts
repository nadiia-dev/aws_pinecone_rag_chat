import { DocumentStatus } from '@prisma/client';

type DocumentStatusType = DocumentStatus;

export type File = {
  id: string;
  userEmail: string;
  fileName: string;
  s3Key: string;
  status?: DocumentStatusType;
  createdAt?: Date;
};

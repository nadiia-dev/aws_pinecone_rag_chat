export interface FileItem {
  id: string;
  userEmail: string;
  fileName: string;
  s3Key: string;
  status?: "PENDING" | "SUCCESS" | "ERROR";
  createdAt?: string;
}

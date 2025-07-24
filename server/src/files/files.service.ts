import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';
import { CreateFileDto } from './dto/files.dto';
import { DocumentStatusType } from '../common/types/files.type';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { DynamoDbService } from 'src/dynamo-db/dynamo-db.service';

@Injectable()
export class FilesService {
  constructor(
    private dynamoDb: DynamoDbService,
    private readonly s3: S3Service,
    private readonly configService: ConfigService,
    private readonly pineconeService: PineconeService,
  ) {}

  async getUrl({
    fileName,
    fileType,
    userEmail,
  }: {
    fileName: string;
    fileType: string;
    userEmail: string;
  }): Promise<{ presignedUrl: string; key: string }> {
    const timestamp = Date.now();
    const key = `${timestamp}_${fileName}`;
    const url = await this.s3.uploadFile(
      this.configService.get<string>('S3_BUCKET')!,
      key,
      fileType,
      userEmail,
    );
    return { presignedUrl: url, key };
  }

  async upload(documentData: CreateFileDto) {
    return await this.dynamoDb.putItem(documentData);
  }

  async list(s3Key: string) {
    return this.dynamoDb.getItem(s3Key);
  }

  async delete(s3Key: string) {
    try {
      const res = await this.s3.deleteFile(
        this.configService.get<string>('S3_BUCKET')!,
        s3Key,
      );

      const isSuccess =
        res.DeleteMarker === true ||
        res.$metadata?.httpStatusCode === 204 ||
        res.$metadata?.httpStatusCode === 200;

      if (!isSuccess) {
        throw new Error('Failed to delete file from S3');
      }

      const embeddingsRes =
        await this.pineconeService.deleteEmbeddingsByS3Key(s3Key);

      if (embeddingsRes.status === 'error') {
        throw new Error(
          `Failed to delete file embeddings from Pinecone db: ${embeddingsRes.message}`,
        );
      }

      return await this.dynamoDb.deleteItem(s3Key);
    } catch (e) {
      console.error('Error while deleting file:', e);
      throw new Error('Document deletion failed');
    }
  }

  async updateStatus(s3Key: string, status: DocumentStatusType) {
    const updatedDocument = await this.dynamoDb.updateStatus(s3Key, status);
    return {
      message: 'Document status updated successfully',
      status: updatedDocument?.status as DocumentStatusType,
    };
  }

  async getStatus(s3Key: string) {
    return await this.dynamoDb.getStatus({ s3Key });
  }
}

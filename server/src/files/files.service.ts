import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { CreateFileDto } from './dto/files.dto';
import { File } from './files.type';
import { DocumentStatus } from '@prisma/client';
import { PineconeService } from 'src/pinecone/pinecone.service';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
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
    const key = `uploads/${timestamp}_${fileName}`;
    const url = await this.s3.uploadFile(
      this.configService.get<string>('S3_BUCKET')!,
      key,
      fileType,
      userEmail,
    );
    return { presignedUrl: url, key };
  }

  async upload(documentData: CreateFileDto): Promise<File> {
    return await this.prisma.file.create({
      data: documentData,
    });
  }

  async list(email: string): Promise<File> {
    return (await this.prisma.file.findFirst({
      where: { userEmail: email },
    })) as File;
  }

  async delete(id: string) {
    try {
      const document = await this.prisma.file.findUnique({ where: { id } });

      if (!document) {
        throw new Error('Document not found');
      }

      const res = await this.s3.deleteFile(
        this.configService.get<string>('S3_BUCKET')!,
        document.s3Key,
      );

      const isSuccess =
        res.DeleteMarker === true ||
        res.$metadata?.httpStatusCode === 204 ||
        res.$metadata?.httpStatusCode === 200;

      if (!isSuccess) {
        throw new Error('Failed to delete file from S3');
      }

      const embeddingsRes = await this.pineconeService.deleteEmbeddingsByS3Key(
        document.s3Key,
      );

      if (embeddingsRes.status === 'error') {
        throw new Error(
          `Failed to delete file embeddings from Pinecone db: ${embeddingsRes.message}`,
        );
      }

      return await this.prisma.file.delete({ where: { id } });
    } catch (e) {
      console.error('Error while deleting file:', e);
      throw new Error('Document deletion failed');
    }
  }

  async updateStatus(s3Key: string, status: DocumentStatus) {
    const updatedDocument = await this.prisma.file.update({
      where: { s3Key },
      data: { status },
    });
    return {
      message: 'Document status updated successfully',
      status: updatedDocument.status,
    };
  }

  async getStatus(id: string): Promise<string | null> {
    const file = await this.prisma.file.findFirst({ where: { id } });
    return file ? file.status : null;
  }
}

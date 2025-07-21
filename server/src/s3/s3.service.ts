import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  public readonly client: S3Client;

  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) throw new Error(`Missing required env: ${key}`);
    return value;
  }

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      region: this.getRequiredConfig('AWS_REGION'),
      credentials: {
        accessKeyId: this.getRequiredConfig('ACCESS_KEY_ID'),
        secretAccessKey: this.getRequiredConfig('SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(
    bucket: string,
    key: string,
    fileType: string,
    userEmail: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
      Metadata: {
        userEmail,
      },
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 300 });
    return url;
  }

  async getMetadata(bucket: string, key: string) {
    const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
    const headData = await this.client.send(command);
    return headData.Metadata;
  }

  async deleteFile(bucket: string, key: string) {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    const response = await this.client.send(command);

    return response;
  }
}

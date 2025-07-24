import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { DocumentStatusType, FileType } from 'src/common/types/files.type';

@Injectable()
export class DynamoDbService {
  private readonly client: DynamoDBClient;
  private readonly tableName: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new DynamoDBClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('SECRET_ACCESS_KEY')!,
      },
    });

    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME')!;
  }

  async putItem(item: Partial<FileType>) {
    const itemToPut = {
      ...item,
      status: item.status ?? 'PENDING',
    };
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: itemToPut,
        ConditionExpression: 'attribute_not_exists(s3Key)',
      }),
    );

    const { Item } = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { s3Key: item.s3Key },
      }),
    );
    return Item;
  }

  async getItem(s3Key: string) {
    const { Item } = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { s3Key },
      }),
    );
    return Item;
  }

  async updateStatus(s3Key: string, status: DocumentStatusType) {
    console.log('Updating status', { s3Key, status });
    const res = await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { s3Key },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
        ReturnValues: 'ALL_NEW',
      }),
    );

    console.log(res.Attributes);
    return res.Attributes;
  }

  async deleteItem(s3Key: string) {
    return await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { s3Key },
      }),
    );
  }

  async getStatus(key: {
    s3Key: string;
  }): Promise<DocumentStatusType | undefined> {
    const res = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
        ProjectionExpression: '#status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
      }),
    );
    return res.Item?.status as DocumentStatusType | undefined;
  }
}

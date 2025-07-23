import pdf from 'pdf-parse';
import { Readable } from 'stream';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';

interface PdfParseResult {
  numpages: number;
  numrender: number;
  info: any;
  metadata: any;
  text: string;
  version: string;
}

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const getFile = async (bucket: string, key: string): Promise<Buffer> => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);

  if (!response.Body || !(response.Body instanceof Readable)) {
    throw new Error('Invalid S3 response body');
  }

  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as Readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};

export const handler = async (event: S3Event) => {
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

  try {
    const res = await getFile(bucket, key);
    const parsed = await (pdf as (b: Buffer) => Promise<PdfParseResult>)(res);

    return {
      status: 'SUCCESS',
      text: parsed.text,
      s3Key: key,
    };
  } catch (e) {
    return {
      status: 'ERROR',
      message: (e as Error).message,
    };
  }
};

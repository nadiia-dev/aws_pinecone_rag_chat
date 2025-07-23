import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone, Index } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  private readonly index: Index;

  constructor(private readonly configService: ConfigService) {
    const pinecone = new Pinecone({
      apiKey: this.configService.get<string>('PINECONE_API_KEY')!,
    });

    this.index = pinecone.Index(
      this.configService.get<string>('PINECONE_INDEX')!,
    );
  }

  async deleteEmbeddingsByS3Key(s3Key: string) {
    try {
      const ns = this.index.namespace('__default__');
      await ns.deleteAll();

      return { status: 'success', message: `Embeddings for ${s3Key} deleted.` };
    } catch (error) {
      console.error('❌ Pinecone deleteMany error:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }
}

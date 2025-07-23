import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone, Index } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  private readonly index: Index;
  private readonly ns;

  constructor(private readonly configService: ConfigService) {
    const pinecone = new Pinecone({
      apiKey: this.configService.get<string>('PINECONE_API_KEY')!,
    });

    this.index = pinecone.Index(
      this.configService.get<string>('PINECONE_INDEX')!,
    );

    this.ns = this.index.namespace(
      this.configService.get<string>('PINECONE_NAMESPACE')!,
    );
  }

  async querySimilarVectors(
    embedding: number[],
  ): Promise<{ metadata: any; score: number }[]> {
    try {
      const result = await this.ns.query({
        topK: 5,
        vector: embedding,
        includeMetadata: true,
      });

      const matches = result.matches || [];

      return matches
        .filter((match) => match.score && match.score > 0.7)
        .map((match) => ({
          metadata: match.metadata,
          score: match.score!,
        }));
    } catch (err) {
      console.error('Pinecone query error:', err);
      return [];
    }
  }

  async deleteEmbeddingsByS3Key(s3Key: string) {
    try {
      await this.ns.deleteAll();

      return { status: 'success', message: `Embeddings for ${s3Key} deleted.` };
    } catch (error) {
      console.error('Pinecone delete error:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }
}

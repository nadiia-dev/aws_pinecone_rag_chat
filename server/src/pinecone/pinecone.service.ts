import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone, Index } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  private readonly index: Index;
  private thresholdMap: { [maxChunks: number]: number } = {
    5: 0.1,
    20: 0.4,
    Infinity: 0.7,
  };

  constructor(private readonly configService: ConfigService) {
    const pinecone = new Pinecone({
      apiKey: this.configService.get<string>('PINECONE_API_KEY')!,
    });

    this.index = pinecone.Index(
      this.configService.get<string>('PINECONE_INDEX')!,
    );
  }

  getThreshold(numChunks: number): number {
    for (const maxChunksStr of Object.keys(this.thresholdMap)) {
      const maxChunks = Number(maxChunksStr);
      if (numChunks <= maxChunks) {
        return this.thresholdMap[maxChunks];
      }
    }
    return 0.7;
  }

  async querySimilarVectors(
    embedding: number[],
  ): Promise<{ metadata: any; score: number }[]> {
    try {
      const result = await this.index.query({
        topK: 5,
        vector: embedding,
        includeMetadata: true,
      });

      const matches = result.matches || [];
      const threshold = this.getThreshold(matches.length);

      return matches
        .filter((match) => match.score && match.score > threshold)
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
      await this.index.deleteAll();

      return { status: 'success', message: `Embeddings for ${s3Key} deleted.` };
    } catch (error) {
      console.error('Pinecone delete error:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }
}

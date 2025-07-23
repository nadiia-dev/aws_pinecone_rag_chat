import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';
import { PineconeService } from 'src/pinecone/pinecone.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly pineconeService: PineconeService,
    private readonly openaiService: OpenaiService,
  ) {}

  async sendMessage(sender: string, message: string) {
    const embedding = await this.openaiService.getEmbedding(message);

    const chunks = await this.pineconeService.querySimilarVectors(embedding!);

    const prompt = this.openaiService.buildPromptFromChunks(chunks, message);
    return this.openaiService.generateAnswer(prompt);
  }
}

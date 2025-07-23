import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY')!,
    });
  }

  buildPromptFromChunks(
    chunks: { metadata: { text: string } }[],
    question: string,
  ): string {
    const contextText = chunks
      .map((chunk) => chunk.metadata.text)
      .join('\n\n---\n\n');

    return `Using this context: ${contextText} answer this question: ${question}`;
  }

  async getEmbedding(text: string): Promise<number[] | null> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error fetching embedding:', error);
      return null;
    }
  }

  async generateAnswer(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a knowledgeable and concise assistant. Use the provided context to answer the user`s question.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      });

      const message = response.choices[0]?.message?.content;
      if (message) {
        return message;
      } else {
        throw new Error('Unable to generate response.');
      }
    } catch (error) {
      console.error('Error generating answer:', error);
      throw new Error('An error occured while generating response.');
    }
  }
}

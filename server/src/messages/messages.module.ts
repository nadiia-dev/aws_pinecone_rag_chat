import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { OpenaiService } from 'src/openai/openai.service';
import { PineconeService } from 'src/pinecone/pinecone.service';

@Module({
  providers: [MessagesService, OpenaiService, PineconeService],
  controllers: [MessagesController],
})
export class MessagesModule {}

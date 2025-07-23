import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { S3Module } from './s3/s3.module';
import { PineconeService } from './pinecone/pinecone.service';
import { PineconeModule } from './pinecone/pinecone.module';
import { MessagesModule } from './messages/messages.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FilesModule,
    S3Module,
    PineconeModule,
    MessagesModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService, PineconeService],
})
export class AppModule {}

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
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { DynamoDbModule } from './dynamo-db/dynamo-db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FilesModule,
    S3Module,
    PineconeModule,
    MessagesModule,
    OpenaiModule,
    DynamoDbModule,
  ],
  controllers: [AppController],
  providers: [AppService, PineconeService, DynamoDbService],
})
export class AppModule {}

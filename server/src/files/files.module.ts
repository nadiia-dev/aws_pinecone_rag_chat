import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { S3Service } from 'src/s3/s3.service';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { DynamoDbService } from 'src/dynamo-db/dynamo-db.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, S3Service, PineconeService, DynamoDbService],
})
export class FilesModule {}

import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { PineconeService } from 'src/pinecone/pinecone.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, PrismaService, S3Service, PineconeService],
})
export class FilesModule {}

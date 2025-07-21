import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, PrismaService, S3Service],
})
export class FilesModule {}

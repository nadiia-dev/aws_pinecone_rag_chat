import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/files.dto';
import { DocumentStatusType } from '../common/types/files.type';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/generate-presigned-url')
  getUrl(
    @Body() fileData: { fileName: string; fileType: string; userEmail: string },
  ) {
    return this.filesService.getUrl(fileData);
  }

  @Post('/upload')
  uploadFile(@Body() fileData: CreateFileDto) {
    return this.filesService.upload(fileData);
  }

  @Get('/uploaded/:s3Key')
  getFiles(@Param('s3Key') s3Key: string) {
    return this.filesService.list(s3Key);
  }

  @Delete('/:s3Key')
  deleteFile(@Param('s3Key') s3Key: string) {
    return this.filesService.delete(s3Key);
  }

  @Patch('/update')
  updateFileStatus(
    @Body() body: { s3Key: string; status: DocumentStatusType },
  ) {
    return this.filesService.updateStatus(body.s3Key, body.status);
  }

  @Get('/:s3Key')
  getFileStatus(@Param('s3Key') s3Key: string) {
    return this.filesService.getStatus(s3Key);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/files.dto';
import { DocumentStatus } from '@prisma/client';

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

  @Get()
  getFiles(@Query() query: { email: string }) {
    return this.filesService.list(query.email);
  }

  @Delete('/:id')
  deleteFile(@Param('id') id: string) {
    return this.filesService.delete(id);
  }

  @Patch('/update')
  updateFileStatus(@Body() body: { s3Key: string; status: DocumentStatus }) {
    return this.filesService.updateStatus(body.s3Key, body.status);
  }

  @Get('/:id')
  getFileStatus(@Param(':id') id: string) {
    return this.filesService.getStatus(id);
  }
}

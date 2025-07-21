import { DocumentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateFileDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  fileName: string;

  @IsString()
  @IsUrl()
  s3Key: string;

  @IsOptional()
  @IsString()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;
}

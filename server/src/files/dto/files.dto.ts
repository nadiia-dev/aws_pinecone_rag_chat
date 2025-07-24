import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { DocumentStatusType } from 'src/common/types/files.type';

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
  status?: DocumentStatusType;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;
}

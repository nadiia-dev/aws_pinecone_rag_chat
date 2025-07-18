import { IsEmail, IsString, IsUrl } from 'class-validator';

export class CreateDocumentDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  filename: string;

  @IsString()
  objectKey: string;

  @IsString()
  @IsUrl()
  s3Url: string;
}

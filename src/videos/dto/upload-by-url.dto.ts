import { IsNotEmpty, IsUrl } from 'class-validator';

export class UploadByUrlDto {
  @IsNotEmpty()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
  })
  url: string;
}

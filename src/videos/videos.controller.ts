import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Response,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UploadByUrlDto } from './dto/upload-by-url.dto';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}
  @Get()
  getAll() {
    return this.videosService.getAll();
  }
  @Get(':id')
  async download(
    @Res() res: Response,
    @Param('id') videoId: number,
  ): Promise<StreamableFile> {
    const stream = await this.videosService.download(videoId);
    // TODO find way how to download file instead streaming
    return new StreamableFile(stream);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3000 * 1048576 }),
          new FileTypeValidator({ fileType: /mp4|mov|avi|mkv/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.videosService.insert(file.buffer, file.originalname, file.size);
  }

  @Post('upload-by-url')
  uploadByUrl(@Body() uploadByUrlDto: UploadByUrlDto) {
    if (
      ['.mp4', '.mov', '.avi', '.mkv'].includes(extname(uploadByUrlDto.url)) ===
      false
    ) {
      throw new BadRequestException(
        `url extension mustbe 'mp4', 'mov', 'avi', 'mkv'`,
      );
    }
    return this.videosService.uploadByUrl(uploadByUrlDto.url);
  }
}

import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}
  @Get()
  getAll() {
    return this.videosService.getAll();
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
}

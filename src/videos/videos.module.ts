import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloaderProcessor } from './downloader.processor';
import { Video } from './entity/video.entity';
import { VideoProcessor } from './video.processor';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    BullModule.registerQueue(
      {
        name: 'download',
      },
      {
        name: 'video',
      },
    ),
  ],
  controllers: [VideosController],
  providers: [VideoProcessor, DownloaderProcessor, VideosService],
})
export class VideosModule {}

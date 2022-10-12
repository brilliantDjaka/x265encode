import { Module } from '@nestjs/common';
import { DownloaderProcessor } from './downloader.processor';
import { VideosModule } from '../videos/videos.module';

@Module({
  imports: [VideosModule],
  providers: [DownloaderProcessor],
})
export class DownloaderModule {}

import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { VideosService } from './videos.service';

@Processor('video')
export class VideoProcessor {
  constructor(private readonly videosService: VideosService) {}
  @Process({ concurrency: 1 })
  async processQueue(job: Job<number>) {
    Logger.log(`Processing video #${job.data}`, VideoProcessor.name);
    await this.videosService.encode(job.data);
    Logger.log(`Processing finished video #${job.data}`, VideoProcessor.name);
  }
}

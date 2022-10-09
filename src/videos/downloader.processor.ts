import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { createReadStream, createWriteStream } from 'fs';
import { basename } from 'path';
import { get } from 'https';
import { VideosService } from './videos.service';

@Processor('download')
export class DownloaderProcessor {
  constructor(private readonly videoService: VideosService) {}
  @Process({ concurrency: 1 })
  async doTheJob(job: Job) {
    const { url } = job.data as { url: string; videoId: string };
    const target = `/tmp/video/${basename(url)}`;

    Logger.debug('Download start' + url, DownloaderProcessor.name);

    await this.downloadFile(url, target);
    const stream = createReadStream(target);

    Logger.log('Download Finished ' + url, DownloaderProcessor.name);

    await this.videoService.insert(stream, basename(url), 0);
  }

  // // 3rd party code
  private async downloadFile(url: string, targetFile: string) {
    return await new Promise((resolve, reject) => {
      get(url, (response) => {
        const code = response.statusCode ?? 0;

        if (code >= 400) {
          return reject(new Error(response.statusMessage));
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return this.downloadFile(response.headers.location, targetFile);
        }

        const fileWriter = createWriteStream(targetFile).on('finish', () => {
          resolve({});
        });

        response.pipe(fileWriter);
      }).on('error', (error) => {
        reject(error);
      });
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/videos/entity/video.entity';
import { Repository } from 'typeorm';
import { writeFile, mkdir } from 'fs/promises';
import { extname } from 'path';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { spawn } from 'child_process';
import { Readable } from 'stream';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private readonly videoRepo: Repository<Video>,
    @InjectQueue('video') private readonly videoQueue: Queue<number>,
  ) {}
  getAll() {
    return this.videoRepo.find({ order: { id: 'desc' } });
  }
  async insert(stream: Readable, fileName: string, size: number) {
    const video = await this.videoRepo.insert({
      fileName: fileName,
      fileSize: size,
    });
    const id: number = video.identifiers[0].id;
    mkdir(`./uploads/${id}/`, { recursive: true })
      .then(() => {
        return writeFile(`./uploads/${id}/raw${extname(fileName)}`, stream);
      })
      .then(() => {
        return this.videoRepo.update(id, { saved: true });
      })
      .then(() => {
        return this.videoQueue.add(id);
      })
      .then((bullJob) => {
        return this.videoRepo.update(id, { jobId: +bullJob.id });
      })
      .then(() => {
        Logger.log(`Success Saving File #${id}`, VideosService.name);
      });

    return id;
  }

  //Heavy Function
  async encode(videoId: number) {
    const video = await this.videoRepo.findOneOrFail({
      where: { id: videoId },
    });

    await this.videoRepo.update(videoId, { processed: true });

    await new Promise<void>((resolve, reject) => {
      const ffmpegProcess = spawn(`ffmpeg`, [
        '-i',
        `uploads/${videoId}/raw${extname(video.fileName)}`,
        '-c:v',
        'libx265',
        '-c:a',
        'copy',
        `uploads/${videoId}/encoded.mp4`,
      ]);
      ffmpegProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else reject();
      });
    })
      .catch(() => this.videoRepo.update(videoId, { error: true }))
      .then(() => this.videoRepo.update(videoId, { finished: true }));

    return;
  }
}

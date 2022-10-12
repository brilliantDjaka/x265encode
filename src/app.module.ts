import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { DownloaderModule } from './downloader/downloader.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/videos.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    VideosModule,
    DownloaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ type: 'boolean', default: false })
  saved: boolean;

  @Column({ nullable: true })
  jobId: number;

  @Column({ type: 'boolean', default: false })
  processed: boolean;

  @Column({ type: 'boolean', default: false })
  finished: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

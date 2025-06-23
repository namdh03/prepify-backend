import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ImageType } from '~constants/image.constant';

@Entity({ name: 'image' })
export class Image {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv4();

  @Column()
  url!: string;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  type!: ImageType;

  @Column({ name: 'entity_id' })
  entityId!: string;
}

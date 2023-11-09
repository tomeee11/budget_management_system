import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategorieType } from '../enum/categorie-type.enum';

@Entity()
export class Categorie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: CategorieType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

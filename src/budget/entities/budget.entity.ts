import { User } from 'src/auth/entities/auth.entity';
import { Categorie } from 'src/categorie/entities/categorie.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ default: null })
  period: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.budget, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Categorie, (categorie) => categorie.budget, {
    onDelete: 'CASCADE',
  })
  categorie: Categorie;
}

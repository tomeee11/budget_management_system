import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CategorieType } from '../enum/categorie-type.enum';
import { User } from 'src/auth/entities/auth.entity';
import { Budget } from 'src/budget/entities/budget.entity';

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

  @OneToMany(() => Budget, (budget) => budget.categorie, { cascade: true })
  budget: Budget;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CategorieType } from '../enum/categorie-type.enum';
import { Budget } from 'src/budget/entities/budget.entity';
import { Expense } from 'src/expense/entities/expense.entity';

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

  @OneToMany(() => Expense, (expense) => expense.categorie, { cascade: true })
  expense: Expense;
}

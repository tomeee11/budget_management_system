import { Categorie } from 'src/categorie/entities/categorie.entity';
import { ExpenseModule } from '../expense.module';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expense_date: Date;

  @Column()
  amount: number;

  @Column()
  memo: string;

  @Column({ default: false })
  isExclud: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.expense, { onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => Categorie, (categorie) => categorie.expense, {
    onDelete: 'CASCADE',
  })
  categorie: Categorie;
}

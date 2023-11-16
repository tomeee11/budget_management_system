import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { PassportModule } from '@nestjs/passport';
import { CategorieModule } from 'src/categorie/categorie.module';
import { ConsultingService } from './consulting.service';
import { BudgetModule } from 'src/budget/budget.module';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CategorieModule,
    BudgetModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService, ConsultingService, StatisticsService],
})
export class ExpenseModule {}

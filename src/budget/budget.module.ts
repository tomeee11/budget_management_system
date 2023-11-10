import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { PassportModule } from '@nestjs/passport';
import { CategorieModule } from 'src/categorie/categorie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CategorieModule,
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}

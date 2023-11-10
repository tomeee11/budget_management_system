import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/deco/get-user.decorator';
import { User } from 'src/auth/entities/auth.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Controller('api/categorie')
@UseGuards(AuthGuard())
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('budget')
  async setBudget(
    @GetUser() user: User,
    @Body() createBudgetDto: CreateBudgetDto,
  ): Promise<any> {
    await this.budgetService.saveBudget(user, createBudgetDto);
    return {
      message: '예산이 설정되었습니다 ',
    };
  }
}

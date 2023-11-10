import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/deco/get-user.decorator';
import { User } from 'src/auth/entities/auth.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('api')
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

  @Patch('budget/:id')
  async modifyBudget(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ): Promise<any> {
    await this.budgetService.updateBudget(user, id, updateBudgetDto);
    return {
      message: '수정이 완료되었습니다.',
    };
  }

  @Post('budget/auto-distribute')
  async autoDistributeBudget(
    @GetUser() user: User,
    @Body('amount') amount: number,
  ): Promise<any> {
    const recommendedBudget = await this.budgetService.autoDistributeBudget(
      amount,
    );
    return recommendedBudget;
  }
}

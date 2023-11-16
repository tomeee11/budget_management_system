import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/deco/get-user.decorator';
import { User } from 'src/auth/entities/auth.entity';
import { Expense } from './entities/expense.entity';
import { ExpenseListQueryDto } from './dto/query-expense.dto';
import { ConsultingService } from './consulting.service';
import { ExpenseComparisonQueryDto } from './dto/comparison-expense.dto';
import { StatisticsService } from './statistics.service';

@Controller('api/expense')
@UseGuards(AuthGuard())
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly consultingService: ConsultingService,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Post()
  async createExpense(
    @GetUser() user: User,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<any> {
    await this.expenseService.saveExpense(user, createExpenseDto);
    return {
      message: '지출이 생성되었습니다.',
    };
  }

  @Patch('/:id')
  async modifyExpense(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<any> {
    await this.expenseService.updateExpense(user, id, updateExpenseDto);
    return {
      message: '생성된 지출이 수정되었습니다.',
    };
  }

  @Delete('/:id')
  async deleteExpense(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<any> {
    await this.expenseService.removeExpense(user, id);
    return {
      message: '생성된 지출이 삭제되었습니다',
    };
  }

  @Get('/:id')
  async getExpenseDetail(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<Expense> {
    return await this.expenseService.findOneExpense(user, id);
  }

  @Get()
  async getExpenseList(
    @GetUser() user: User,
    @Query() expenseListQueryDto: ExpenseListQueryDto,
  ): Promise<any> {
    return await this.expenseService.findExpense(user, expenseListQueryDto);
  }

  @Get('/consulting/recommendation')
  getRecommendation(@GetUser() user: User) {
    return this.consultingService.generateRecommendation(user);
  }

  @Get('/consulting/today')
  getTodayExpenses(@GetUser() user: User) {
    return this.consultingService.getTodaySummary(user);
  }

  @Get('/type/statistics')
  async getExpenseStatistics(
    @GetUser() user: User,
    @Query() expenseComparisonQueryDto: ExpenseComparisonQueryDto,
  ): Promise<any> {
    const statistics = await this.statisticsService.compareExpenses(
      user,
      expenseComparisonQueryDto,
    );

    return statistics;
  }
}

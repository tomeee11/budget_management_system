import { Injectable } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { BudgetService } from 'src/budget/budget.service';
import { CategorieService } from 'src/categorie/categorie.service';
import { User } from 'src/auth/entities/auth.entity';
import { ComparisonType } from './enum/comparison-type .enum';
import { ExpenseComparisonQueryDto } from './dto/comparison-expense.dto';
import { Between } from 'typeorm';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { Expense } from './entities/expense.entity';

@Injectable()
export class StatisticsService {
  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService,
    private categorieService: CategorieService,
  ) {}

  async compareExpenses(
    user: User,
    expenseComparisonQueryDto: ExpenseComparisonQueryDto,
  ) {
    if (expenseComparisonQueryDto.type === ComparisonType.Month) {
      return await this.compareExpensesLastMonth(user);
    } else if (expenseComparisonQueryDto.type === ComparisonType.Day) {
      return await this.compareExpensesLastWeek(user);
    }
  }

  async compareExpensesLastMonth(user: User) {
    const today = new Date();

    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    const currentExpenses = await this.fetchExpensesInDateRange(
      user,
      currentMonthStart,
      today,
    );

    const lastMonthStart = new Date(currentMonthStart);
    lastMonthStart.setMonth(currentMonthStart.getMonth() - 1);

    const lastMonthToday = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
    );

    const lastExpenses = await this.fetchExpensesInDateRange(
      user,
      lastMonthStart,
      lastMonthToday,
    );

    const weeklyExpensesIncrease = await this.calculateExpenses(
      currentExpenses,
      lastExpenses,
    );
    return weeklyExpensesIncrease;
  }

  async compareExpensesLastWeek(user: User) {
    const today = new Date();

    const todayStartOfDay = startOfDay(today);
    const todayEndOfDay = endOfDay(today);

    const currentExpenses = await this.fetchExpensesInDateRange(
      user,
      todayStartOfDay,
      todayEndOfDay,
    );

    const lastWeekStartDate = addDays(today, -7);

    const lastWeekStartOfDay = startOfDay(lastWeekStartDate);
    const lastWeekEndOfDay = endOfDay(lastWeekStartDate);

    const lastExpenses = await this.fetchExpensesInDateRange(
      user,
      lastWeekStartOfDay,
      lastWeekEndOfDay,
    );

    const dayOfWeekNumber = today.getDay();
    const dayOfWeekString = this.getDayOfWeekString(dayOfWeekNumber);

    const weeklyExpensesIncrease = await this.calculateExpensesIncrease(
      currentExpenses,
      lastExpenses,
    );

    return {
      [dayOfWeekString]: weeklyExpensesIncrease,
    };
  }

  calculateExpensesIncrease(
    currentExpenses: Expense[],
    lastExpenses: Expense[],
  ) {
    const currentTotal = currentExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0,
    );
    const lastTotal = lastExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0,
    );

    const percentageIncrease = ((currentTotal - lastTotal) / lastTotal) * 100;

    return `${percentageIncrease}%`;
  }

  async calculateExpenses(
    currentExpenses: Expense[],
    lastExpenses: Expense[],
  ): Promise<{ [categoryTitle: string]: string }> {
    const result: { [categoryTitle: string]: string } = {};

    for (const expense of currentExpenses) {
      const categoryTitle = expense.categorie.title;
      const amount = expense.amount;

      if (!result[categoryTitle]) {
        result[categoryTitle] = '';
      }

      if (lastExpenses.some((e) => e.categorie.title === categoryTitle)) {
        const lastMonthAmount = lastExpenses.find(
          (e) => e.categorie.title === categoryTitle,
        )?.amount;

        const percentage =
          lastMonthAmount && lastMonthAmount !== 0
            ? `${Math.round((amount / lastMonthAmount) * 100)}%`
            : '100%';

        result[categoryTitle] = `${categoryTitle} 지난달 대비 ${percentage}`;
      }
    }

    return result;
  }

  getDayOfWeekString(dayOfWeek: number): string {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    return daysOfWeek[dayOfWeek];
  }

  async fetchExpensesInDateRange(user: User, startDate: Date, endDate: Date) {
    return await this.expenseService.find({
      where: {
        user: { id: user.id },
        expense_date: Between(startDate, endDate),
      },

      relations: ['categorie'],
    });
  }
}

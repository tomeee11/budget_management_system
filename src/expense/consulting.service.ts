import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { User } from 'src/auth/entities/auth.entity';
import { BudgetService } from 'src/budget/budget.service';
import { Expense } from './entities/expense.entity';
import { Budget } from 'src/budget/entities/budget.entity';
import { CategorieService } from 'src/categorie/categorie.service';

@Injectable()
export class ConsultingService {
  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService,
    private categorieService: CategorieService,
  ) {}

  async getTodaySummary(user: User) {
    const today = new Date();
    const todayDateString = today.toISOString().slice(0, 10);

    const categories = await this.categorieService.find({});

    const categoryBudgetMap = {};
    categories.forEach((category) => {
      categoryBudgetMap[category.title] = category.monthlyBudget / 30;
    });

    const todayExpenses = await this.expenseService.find({
      where: {
        user: { id: user.id },
      },
      relations: ['categorie'],
    });

    const summary = {
      totalAmount: 0,
      categorySummaries: {},
    };

    todayExpenses.forEach((expense) => {
      const expenseDate = expense.expense_date.toISOString().slice(0, 10);

      if (expenseDate === todayDateString) {
        summary.totalAmount += expense.amount;
        const categoryTitle = expense.categorie.title;

        if (!summary.categorySummaries[categoryTitle]) {
          summary.categorySummaries[categoryTitle] = {
            totalAmount: 0,
            expenses: [],
          };
        }

        summary.categorySummaries[categoryTitle].totalAmount += expense.amount;
        summary.categorySummaries[categoryTitle].expenses.push(expense);

        const dailyBudget = categoryBudgetMap[categoryTitle];
        const optimalAmount = dailyBudget;
        const riskPercentage =
          ((expense.amount - optimalAmount) / optimalAmount) * 100;
        summary.categorySummaries[categoryTitle].optimalAmount = optimalAmount;
        summary.categorySummaries[categoryTitle].riskPercentage =
          riskPercentage;
      }
    });

    return summary;
  }

  async generateRecommendation(user: User) {
    const budgets = await this.budgetService.find({
      where: { user: { id: user.id } },
      relations: ['categorie'],
    });

    if (budgets.length === 0) {
      throw new HttpException(
        '예산이 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    const expenses = await this.expenseService.find({
      where: { user: { id: user.id } },
    });

    const totalExpense = expenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );

    const totalBudget = budgets.reduce(
      (total, budget) => total + budget.amount,
      0,
    );
    const remainingBudget = totalBudget - totalExpense;

    const categoryAmounts = this.calculateCategoryAmounts(budgets, expenses);
    const userMessage = this.generateUserMessage(remainingBudget);

    return {
      totalAmount: remainingBudget,
      categoryAmounts,
      userMessage,
    };
  }

  calculateCategoryAmounts(budgets: Budget[], expenses: Expense[]) {
    const categoryAmounts: any[] = [];
    for (const budget of budgets) {
      const categoryExpenses = expenses.filter(
        (expense) => expense.categorie === budget.categorie,
      );
      const categoryExpenseTotal = categoryExpenses.reduce(
        (total, expense) => total + expense.amount,
        0,
      );
      const remainingCategoryBudget = budget.amount - categoryExpenseTotal;

      categoryAmounts.push({
        category: budget.categorie,
        amount: Math.max(remainingCategoryBudget, 0),
      });
    }
    return categoryAmounts;
  }

  generateUserMessage(remainingBudget: number) {
    let userMessage = '오늘 예산을 즐겁게 사용하세요!';
    if (remainingBudget === 0) {
      userMessage = '오늘 예산을 모두 사용했습니다. 조심히 지출하세요.';
    } else if (remainingBudget < 1000) {
      userMessage = '오늘은 조금만 사용하세요. 지출을 관리하세요!';
    } else if (remainingBudget < 5000) {
      userMessage = '잘 아끼고 있습니다! 오늘도 절약 도전!';
    }
    return userMessage;
  }
}

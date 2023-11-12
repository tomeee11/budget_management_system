import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { CategorieService } from 'src/categorie/categorie.service';
import { Categorie } from 'src/categorie/entities/categorie.entity';
import { ExpenseListQueryDto } from './dto/query-expense.dto';
import { ExpenseSummary } from './dto/sum-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private categorieService: CategorieService,
  ) {}

  async saveExpense(
    user: User,
    createExpenseDto: CreateExpenseDto,
  ): Promise<void> {
    const categorieFind = await this.categorieService.findOne({
      where: { title: createExpenseDto.title },
    });

    if (!categorieFind) {
      throw new HttpException(
        '카테고리가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.save(user, categorieFind, createExpenseDto);
  }

  async updateExpense(
    user: User,
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<void> {
    const expenseFind = await this.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!expenseFind) {
      throw new HttpException(
        '생성한 지출을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.update(expenseFind, updateExpenseDto);
  }

  async removeExpense(user: User, id: number): Promise<void> {
    const expenseFind = await this.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!expenseFind) {
      throw new HttpException(
        '생성한 지출을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.remove(expenseFind);
  }

  async findOneExpense(user: User, id: number): Promise<Expense> {
    const expenseFind = await this.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!expenseFind) {
      throw new HttpException(
        '생성한 지출을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    return expenseFind;
  }

  async findExpense(
    user: User,
    expenseListQueryDto: ExpenseListQueryDto,
  ): Promise<ExpenseSummary> {
    const expenses = await this.expensesQuery(expenseListQueryDto, user);

    const filteredExpenses = expenses.filter((expense) => !expense.isExclud);

    const totalAmount = filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );

    const categorySummaries = new Map<string, number>();

    filteredExpenses.forEach((expense) => {
      if (expense.categorie && expense.categorie.title) {
        const categoryTitle = expense.categorie.title;
        const amount = expense.amount;

        categorySummaries.set(
          categoryTitle,
          (categorySummaries.get(categoryTitle) || 0) + amount,
        );
      }
    });

    const categorySummariesArray = Array.from(categorySummaries).map(
      ([category, amount]) => ({
        category,
        amount,
      }),
    );

    return new ExpenseSummary(totalAmount, categorySummariesArray);
  }
  async expensesQuery(
    expenseListQueryDto: ExpenseListQueryDto,
    user: User,
  ): Promise<Expense[]> {
    const { startDate, endDate, title, minAmount, maxAmount, excludeTotal } =
      expenseListQueryDto;

    const queryBuilder = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.categorie', 'categorie')
      .where('expense.user = :user', { user: user.id });

    if (title) {
      queryBuilder.andWhere('categorie.title = :title', { title });
    }

    if (startDate) {
      queryBuilder.andWhere('expense.expense_date >= :startDate', {
        startDate,
      });
    }

    if (endDate) {
      queryBuilder.andWhere('expense.expense_date <= :endDate', { endDate });
    }

    if (minAmount) {
      queryBuilder.andWhere('expense.amount >= :minAmount', { minAmount });
    }

    if (maxAmount) {
      queryBuilder.andWhere('expense.amount <= :maxAmount', { maxAmount });
    }

    return queryBuilder.getMany();
  }

  async find(options: FindOneOptions<Expense>): Promise<Expense[]> {
    return await this.expenseRepository.find(options);
  }

  async findOne(options: FindOneOptions<Expense>): Promise<Expense> {
    return await this.expenseRepository.findOne(options);
  }

  async update(
    expenseFind: Expense,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<void> {
    await this.expenseRepository
      .createQueryBuilder()
      .update(Expense)
      .set({
        amount: updateExpenseDto.amount,
        memo: updateExpenseDto.memo,
        expense_date: updateExpenseDto.expense_date,
      })
      .where('id = :id', { id: expenseFind.id })
      .execute();
  }

  async remove(expenseFind: Expense): Promise<void> {
    await this.expenseRepository.remove(expenseFind);
  }

  async save(
    user: User,
    categorieFind: Categorie,
    createExpenseDto: CreateExpenseDto,
  ): Promise<void> {
    await this.expenseRepository.save({
      user: { id: user.id },
      categorie: { id: categorieFind.id },
      amount: createExpenseDto.amount,
      memo: createExpenseDto.memo,
      expense_date: createExpenseDto.expense_date,
    });
  }
}

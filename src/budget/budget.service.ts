import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './entities/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { CategorieService } from 'src/categorie/categorie.service';
import { Categorie } from 'src/categorie/entities/categorie.entity';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    private categorieService: CategorieService,
  ) {}

  async saveBudget(
    user: User,
    createBudgetDto: CreateBudgetDto,
  ): Promise<void> {
    const categorieFind = await this.categorieService.findOne({
      where: { title: createBudgetDto.title },
    });

    if (!categorieFind) {
      throw new HttpException(
        '카테고리가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.save(user, categorieFind, createBudgetDto);
  }

  async updateBudget(
    user: User,
    id: number,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<void> {
    const budgetFind = await this.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!budgetFind) {
      throw new HttpException(
        '예산 설정을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.update(budgetFind, updateBudgetDto);
  }

  async autoDistributeBudget(
    amount: number,
  ): Promise<{ [category: string]: number }> {
    const totalBudgets = await this.getTotalBudgets();
    const totalBudget = this.calculateTotalBudget(totalBudgets);
    const recommendedBudget = this.calculateRecommendedBudget(
      totalBudgets,
      totalBudget,
      amount,
    );
    return recommendedBudget;
  }

  async getTotalBudgets() {
    return await this.budgetRepository
      .createQueryBuilder('budget')
      .leftJoin('budget.categorie', 'categorie')
      .select('categorie.title', 'category')
      .addSelect('SUM(budget.amount)', 'amount')
      .groupBy('categorie.title')
      .getRawMany();
  }

  calculateTotalBudget(totalBudgets) {
    return totalBudgets.reduce(
      (total, categoryTotal) => total + parseFloat(categoryTotal.amount),
      0,
    );
  }

  calculateRecommendedBudget(totalBudgets, totalBudget, amount) {
    const recommendedBudget = {};

    totalBudgets.forEach((categoryTotal) => {
      const category = categoryTotal.category;
      const categoryTotalAmount = parseFloat(categoryTotal.amount);
      const categoryPercentage = Math.round(
        (categoryTotalAmount / totalBudget) * 100,
      );
      recommendedBudget[category] = categoryPercentage * amount;
    });

    return recommendedBudget;
  }

  async find(options: FindOneOptions<Budget>): Promise<Budget[]> {
    return await this.budgetRepository.find(options);
  }

  async findOne(options: FindOneOptions<Budget>): Promise<Budget> {
    return await this.budgetRepository.findOne(options);
  }

  async save(
    user: User,
    categorieFind: Categorie,
    createBudgetDto: CreateBudgetDto,
  ): Promise<void> {
    await this.budgetRepository.save({
      user: { id: user.id },
      categorie: { id: categorieFind.id },
      amount: createBudgetDto.amount,
    });
  }

  async update(
    budgetFind: Budget,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<void> {
    await this.budgetRepository
      .createQueryBuilder()
      .update(Budget)
      .set({
        amount: updateBudgetDto.amount,
      })
      .where('id = :id', { id: budgetFind.id })
      .execute();
  }
}

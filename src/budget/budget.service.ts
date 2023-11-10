import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './entities/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { CategorieService } from 'src/categorie/categorie.service';
import { Categorie } from 'src/categorie/entities/categorie.entity';

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

  async save(
    user: User,
    categorieFind: Categorie,
    createBudgetDto: CreateBudgetDto,
  ) {
    await this.budgetRepository.save({
      user: { id: user.id },
      categorie: { id: categorieFind.id },
      amount: createBudgetDto.amount,
    });
  }
}

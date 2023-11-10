import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categorie } from './entities/categorie.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(Categorie)
    private categorieRepository: Repository<Categorie>,
  ) {}

  async findAllTitle(): Promise<Categorie[]> {
    return await this.find({
      select: ['title'],
    });
  }

  async find(
    options: FindOneOptions<Categorie>,
  ): Promise<Categorie[] | undefined> {
    return await this.categorieRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<Categorie>,
  ): Promise<Categorie | undefined> {
    return await this.categorieRepository.findOne(options);
  }
}

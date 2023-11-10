import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { AuthGuard } from '@nestjs/passport';
import { Categorie } from './entities/categorie.entity';

@UseGuards(AuthGuard())
@Controller('api/categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Get()
  async findAllCategorie(): Promise<Categorie[]> {
    return await this.categorieService.findAllTitle();
  }
}

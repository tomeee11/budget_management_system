import { Controller } from '@nestjs/common';
import { CategorieService } from './categorie.service';

@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetDto } from './create-budget.dto';
import { CategorieType } from 'src/categorie/enum/categorie-type.enum';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  title?: CategorieType;
  amount?: number;
}

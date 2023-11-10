import { IsNumber, IsString } from 'class-validator';
import { CategorieType } from 'src/categorie/enum/categorie-type.enum';

export class CreateBudgetDto {
  @IsNumber()
  amount: number;
  @IsString()
  title: CategorieType;
}

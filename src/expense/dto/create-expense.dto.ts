import { IsDateString, IsNumber, IsString } from 'class-validator';
import { CategorieType } from 'src/categorie/enum/categorie-type.enum';

export class CreateExpenseDto {
  @IsNumber()
  amount: number;

  @IsString()
  title: CategorieType;

  @IsString()
  memo: string;

  @IsDateString()
  expense_date: Date;
}

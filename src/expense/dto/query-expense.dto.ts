import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategorieType } from 'src/categorie/enum/categorie-type.enum';

export class ExpenseListQueryDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  title: CategorieType;

  @IsString()
  minAmount: number;

  @IsString()
  maxAmount: number;
}

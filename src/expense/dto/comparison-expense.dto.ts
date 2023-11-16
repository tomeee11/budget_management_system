import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ComparisonType } from '../enum/comparison-type .enum';

export class ExpenseComparisonQueryDto {
  @IsEnum(ComparisonType)
  @IsNotEmpty()
  type: ComparisonType;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  otherUserId: number;
}

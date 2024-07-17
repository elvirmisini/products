import { IsString, IsInt } from 'class-validator';

export class updateProductDto {
  @IsString()
  description: string;

  
}
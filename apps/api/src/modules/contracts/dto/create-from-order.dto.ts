import { IsString, IsNotEmpty, IsUUID, Matches } from 'class-validator';

export class CreateFromOrderDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, {
    message: 'IBAN muss im gültigen Format sein',
  })
  iban: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, {
    message: 'BIC muss im gültigen Format sein',
  })
  bic: string;

  @IsString()
  @IsNotEmpty()
  accountHolder: string;
}

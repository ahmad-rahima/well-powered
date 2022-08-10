import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): Date {
    const val = Date.parse(value)
    if (isNaN(val)) throw new BadRequestException('Bad date form');
    // const val = Number(value);
    // if (isNaN(val)) throw new BadRequestException('Bad date');

    return new Date(value);
  }
}

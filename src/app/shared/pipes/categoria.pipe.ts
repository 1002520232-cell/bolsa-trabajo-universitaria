import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoria',
  standalone: true
})
export class CategoriaPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'practicas':
        return 'Prácticas';
      case 'medio-tiempo':
        return 'Medio Tiempo';
      case 'tiempo-completo':
        return 'Tiempo Completo';
      case 'freelance':
        return 'Freelance';
      default:
        return value;
    }
  }

}

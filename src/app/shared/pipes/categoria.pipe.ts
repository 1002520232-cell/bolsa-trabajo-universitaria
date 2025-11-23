
import { Pipe, PipeTransform } from '@angular/core';

const categoriaMap: { [key: string]: string } = {
  practicas: 'Prácticas',
  'medio-tiempo': 'Medio Tiempo',
  'tiempo-completo': 'Tiempo Completo',
  freelance: 'Freelance'
};

@Pipe({
  name: 'categoria',
  standalone: true
})
export class CategoriaPipe implements PipeTransform {

  transform(value: string): string {
    return categoriaMap[value] || value;
  }
}


import { Pipe, PipeTransform } from '@angular/core';

const estadoMap: { [key: string]: string } = {
  pendiente: 'Pendiente',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada'
};

@Pipe({
  name: 'estado',
  standalone: true
})
export class EstadoPipe implements PipeTransform {

  transform(value: string): string {
    return estadoMap[value] || value;
  }

}


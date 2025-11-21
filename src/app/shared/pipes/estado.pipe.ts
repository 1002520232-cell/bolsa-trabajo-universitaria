import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado',
  standalone: true
})
export class EstadoPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'pendiente':
        return 'Pendiente';
      case 'aceptada':
        return 'Aceptada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return value;
    }
  }

}

@Pipe({
  name: 'estadoPostulacion',
  standalone: true
})
export class EstadoPostulacionPipe implements PipeTransform {

  transform(value: string): string {
    return new EstadoPipe().transform(value) as string;
  }

}

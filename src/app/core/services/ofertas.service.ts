import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OfertaLaboral } from '../models/oferta-laboral.model';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor() { }

  getOfertas(): Observable<OfertaLaboral[]> {
    // Mock data
    const ofertas: OfertaLaboral[] = [
      {
        id: '1',
        titulo: 'Desarrollador Web',
        descripcion: 'Descripción de la oferta',
        categoria: 'Tecnología',
        ubicacion: 'Lima',
        salario: 3000,
        tipoContrato: 'Tiempo completo',
        requisitos: ['Angular', 'TypeScript'],
        fechaPublicacion: new Date(),
        empresaId: '1',
        postulacionesCount: 0,
        activa: true
      }
    ];
    return of(ofertas);
  }

  getOfertaById(id: string): Observable<OfertaLaboral> {
    // Mock data
    const oferta: OfertaLaboral = {
      id,
      titulo: 'Desarrollador Web',
      descripcion: 'Descripción de la oferta',
      categoria: 'Tecnología',
      ubicacion: 'Lima',
      salario: 3000,
      tipoContrato: 'Tiempo completo',
      requisitos: ['Angular', 'TypeScript'],
      fechaPublicacion: new Date(),
      empresaId: '1',
      postulacionesCount: 0,
      activa: true
    };
    return of(oferta);
  }

  getOfertasByEmpresa(empresaId: string): Observable<OfertaLaboral[]> {
    // Mock data
    return this.getOfertas();
  }

  createOferta(oferta: OfertaLaboral): Observable<string> {
    // Mock create
    return of('1');
  }

  updateOferta(id: string, oferta: OfertaLaboral): Observable<void> {
    // Mock update
    return of(void 0);
  }

  incrementarPostulaciones(id: string): Observable<void> {
    // Mock increment
    return of(void 0);
  }
}

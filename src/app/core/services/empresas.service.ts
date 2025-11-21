import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor() { }

  getEmpresas(): Observable<Empresa[]> {
    // Mock data
    const empresas: Empresa[] = [
      {
        id: '1',
        nombre: 'Empresa Ejemplo',
        descripcion: 'Descripción de la empresa',
        sector: 'Tecnología',
        ubicacion: 'Lima',
        sitioWeb: 'https://empresa.com',
        email: 'contacto@empresa.com',
        telefono: '+51 123 456 789',
        fechaCreacion: new Date(),
        userId: 'user1'
      }
    ];
    return of(empresas);
  }

  getEmpresaById(id: string): Observable<Empresa> {
    // Mock data
    const empresa: Empresa = {
      id,
      nombre: 'Empresa Ejemplo',
      descripcion: 'Descripción de la empresa',
      sector: 'Tecnología',
      ubicacion: 'Lima',
      sitioWeb: 'https://empresa.com',
      email: 'contacto@empresa.com',
      telefono: '+51 123 456 789',
      fechaCreacion: new Date(),
      userId: 'user1'
    };
    return of(empresa);
  }

  createEmpresa(empresa: Empresa): Observable<string> {
    // Mock create
    return of('1');
  }

  updateEmpresa(id: string, empresa: Empresa): Observable<void> {
    // Mock update
    return of(void 0);
  }

  deleteEmpresa(id: string): Observable<void> {
    // Mock delete
    return of(void 0);
  }
}

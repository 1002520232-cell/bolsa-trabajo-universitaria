import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, docData, updateDoc, deleteDoc, query, where, Query, DocumentData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private empresasCollection;

  constructor(private firestore: Firestore) {
    this.empresasCollection = collection(this.firestore, 'empresas');
  }

  getEmpresas(): Observable<Empresa[]> {
    return collectionData(this.empresasCollection, { idField: 'id' }) as Observable<Empresa[]>;
  }

  getEmpresaById(id: string): Observable<Empresa> {
    const empresaDoc = doc(this.firestore, `empresas/${id}`);
    return docData(empresaDoc, { idField: 'id' }) as Observable<Empresa>;
  }

  async createEmpresa(empresa: Empresa): Promise<string> {
    const { id, ...empresaData } = empresa;
    const docRef = await addDoc(this.empresasCollection, empresaData);
    return docRef.id;
  }

  async updateEmpresa(id: string, empresa: Empresa): Promise<void> {
    const empresaDoc = doc(this.firestore, `empresas/${id}`);
    const { id: empresaId, ...empresaData } = empresa;
    await updateDoc(empresaDoc, empresaData);
  }

  async deleteEmpresa(id: string): Promise<void> {
    const empresaDoc = doc(this.firestore, `empresas/${id}`);
    await deleteDoc(empresaDoc);
  }

  listEmpresasFiltered(searchText: string = '', filtroSector: string = ''): Observable<Empresa[]> {
    let q: Query<DocumentData> = collection(this.firestore, 'empresas');
    if (filtroSector) {
      q = query(q, where('sector', '==', filtroSector));
    }
    return collectionData(q, { idField: 'id' }).pipe(
      map((documentDataArray: DocumentData[]) => {
        const empresas = documentDataArray.map(doc => doc as Empresa);
        const lowerSearch = searchText.toLowerCase();
        return empresas.filter(empresa =>
          empresa.nombre.toLowerCase().includes(lowerSearch) ||
          (empresa.sector ?? '').toLowerCase().includes(lowerSearch) ||
          empresa.ubicacion.toLowerCase().includes(lowerSearch)
        );
      })
    ) as Observable<Empresa[]>;
  }

  async approveEmpresa(id: string): Promise<void> {
    const empresaDoc = doc(this.firestore, `empresas/${id}`);
    await updateDoc(empresaDoc, { aprobada: true });
  }

  async rejectEmpresa(id: string): Promise<void> {
    const empresaDoc = doc(this.firestore, `empresas/${id}`);
    await updateDoc(empresaDoc, { aprobada: false });
  }
}

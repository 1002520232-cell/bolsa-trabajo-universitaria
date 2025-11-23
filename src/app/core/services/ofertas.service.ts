import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, docData, addDoc, updateDoc, deleteDoc, query, where, increment, Query, DocumentData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { OfertaLaboral } from '../models/oferta-laboral.model';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {
  private ofertasCollection;

  constructor(private firestore: Firestore) {
    this.ofertasCollection = collection(this.firestore, 'ofertas');
  }

  getOfertas(): Observable<OfertaLaboral[]> {
    return collectionData(this.ofertasCollection, { idField: 'id' }) as Observable<OfertaLaboral[]>;
  }

  getOfertaById(id: string): Observable<OfertaLaboral> {
    const ofertaDoc = doc(this.firestore, `ofertas/${id}`);
    return docData(ofertaDoc, { idField: 'id' }) as Observable<OfertaLaboral>;
  }

  getOfertasByEmpresa(empresaId: string): Observable<OfertaLaboral[]> {
    const q = query(this.ofertasCollection, where('empresaId', '==', empresaId));
    return collectionData(q, { idField: 'id' }) as Observable<OfertaLaboral[]>;
  }

  // Added method to get offers by user
  getOfertasByUser(userId: string): Observable<OfertaLaboral[]> {
    const q = query(this.ofertasCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<OfertaLaboral[]>;
  }

  async createOferta(oferta: OfertaLaboral): Promise<string> {
    const { id, ...ofertaData } = oferta;
    const docRef = await addDoc(this.ofertasCollection, ofertaData);
    return docRef.id;
  }

  // Modified updateOferta to accept Partial<OfertaLaboral>
  async updateOferta(id: string, oferta: Partial<OfertaLaboral>): Promise<void> {
    const ofertaDoc = doc(this.firestore, `ofertas/${id}`);
    await updateDoc(ofertaDoc, oferta);
  }

  // Added deleteOferta method
  async deleteOferta(id: string): Promise<void> {
    const ofertaDoc = doc(this.firestore, `ofertas/${id}`);
    await deleteDoc(ofertaDoc);
  }

  async incrementarPostulaciones(id: string): Promise<void> {
    const ofertaDoc = doc(this.firestore, `ofertas/${id}`);
    await updateDoc(ofertaDoc, {
      postulacionesCount: increment(1)
    });
  }

  listOfertasFiltered(
    searchText: string = '',
    filtroCategoria: string = '',
    filtroModalidad: string = '',
    ordenamiento: string = 'recientes'
  ): Observable<OfertaLaboral[]> {
    let q: Query<DocumentData> = collection(this.firestore, 'ofertas');
    const constraints: any[] = [];

    if (filtroCategoria) {
      constraints.push(where('categoria', '==', filtroCategoria));
    }
    if (filtroModalidad) {
      constraints.push(where('modalidad', '==', filtroModalidad));
    }

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    return collectionData(q, { idField: 'id' }).pipe(
      map((documentDataArray: DocumentData[]) => {
        const ofertas = documentDataArray.map(doc => doc as OfertaLaboral);
        const lowerSearch = searchText.toLowerCase();

        let filtered = ofertas.filter(oferta =>
          (oferta.titulo?.toLowerCase().includes(lowerSearch) ||
          oferta.empresaNombre?.toLowerCase().includes(lowerSearch) ||
          oferta.ubicacion?.toLowerCase().includes(lowerSearch))
        );

        switch (ordenamiento) {
          case 'recientes':
            filtered.sort((a, b) =>
              new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
            );
            break;
          case 'antiguas':
            filtered.sort((a, b) =>
              new Date(a.fechaPublicacion).getTime() - new Date(b.fechaPublicacion).getTime()
            );
            break;
          case 'postulaciones':
            filtered.sort((a, b) => (b.postulacionesCount || 0) - (a.postulacionesCount || 0));
            break;
          case 'vacantes':
            filtered.sort((a, b) => (b.vacantes || 0) - (a.vacantes || 0));
            break;
        }
        return filtered;
      })
    ) as Observable<OfertaLaboral[]>;
  }
}

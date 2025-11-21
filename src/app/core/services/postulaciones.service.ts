// src/app/core/services/postulaciones.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, collectionData, query, where, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Postulacion } from '../models/postulacion.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostulacionesService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private postulacionesCollection = collection(this.firestore, 'postulaciones');

  // Obtener postulaciones de un estudiante
  getPostulacionesByEstudiante(estudianteId: string): Observable<Postulacion[]> {
    const q = query(
      this.postulacionesCollection,
      where('estudianteId', '==', estudianteId),
      orderBy('fechaPostulacion', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Postulacion[]>;
  }

  // Obtener postulaciones de una oferta
  getPostulacionesByOferta(ofertaId: string): Observable<Postulacion[]> {
    const q = query(
      this.postulacionesCollection,
      where('ofertaId', '==', ofertaId),
      orderBy('fechaPostulacion', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Postulacion[]>;
  }

  // Verificar si ya existe postulación
  async existePostulacion(ofertaId: string, estudianteId: string): Promise<boolean> {
    const q = query(
      this.postulacionesCollection,
      where('ofertaId', '==', ofertaId),
      where('estudianteId', '==', estudianteId)
    );
    
    const snapshot = await collectionData(q).toPromise();
    return (snapshot?.length || 0) > 0;
  }

  // Crear postulación
  createPostulacion(postulacion: Omit<Postulacion, 'id' | 'fechaPostulacion' | 'estado'>): Observable<string> {
    const nuevaPostulacion: Omit<Postulacion, 'id'> = {
      ...postulacion,
      estado: 'pendiente',
      fechaPostulacion: new Date()
    };

    return from(addDoc(this.postulacionesCollection, nuevaPostulacion).then(ref => ref.id));
  }

  // Actualizar estado de postulación
  updateEstadoPostulacion(id: string, estado: Postulacion['estado'], notas?: string): Observable<void> {
    const postulacionDoc = doc(this.firestore, `postulaciones/${id}`);
    return from(updateDoc(postulacionDoc, {
      estado,
      notas,
      fechaRevision: new Date()
    }));
  }

  // Eliminar postulación
  deletePostulacion(id: string): Observable<void> {
    const postulacionDoc = doc(this.firestore, `postulaciones/${id}`);
    return from(deleteDoc(postulacionDoc));
  }

  // Obtener postulación por ID
  getPostulacionById(id: string): Observable<Postulacion> {
    const postulacionDoc = doc(this.firestore, `postulaciones/${id}`);
    return from(getDoc(postulacionDoc).then(snap => {
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Postulacion;
      }
      throw new Error('Postulación no encontrada');
    }));
  }

  // Obtener estadísticas de postulaciones por estudiante
  async getEstadisticasEstudiante(estudianteId: string): Promise<{
    totalPostulaciones: number;
    pendientes: number;
    revisadas: number;
    aceptadas: number;
    rechazadas: number;
  }> {
    const postulaciones = await from(
      collectionData(
        query(this.postulacionesCollection, where('estudianteId', '==', estudianteId))
      )
    ).toPromise() as Postulacion[];

    return {
      totalPostulaciones: postulaciones.length,
      pendientes: postulaciones.filter(p => p.estado === 'pendiente').length,
      revisadas: postulaciones.filter(p => p.estado === 'revisada').length,
      aceptadas: postulaciones.filter(p => p.estado === 'aceptada').length,
      rechazadas: postulaciones.filter(p => p.estado === 'rechazada').length
    };
  }
}
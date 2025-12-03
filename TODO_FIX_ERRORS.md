# TODO: Arreglar Errores de Compilación

## Pasos a Completar

- [x] Agregar propiedades faltantes (fechaCreacion, userId) a los objetos Empresa en empresas.service.ts
- [x] Cambiar 'categoriaOferta' por 'categoria' en empresa-detail.component.ts
- [x] Cambiar CategoriaOfertaPipe por CategoriaPipe en imports de home.component.ts y oferta-detail.component.ts
- [x] Agregar totalPostulaciones al objeto stats en estadisticas.component.ts
- [x] Corregir uso de toDate en templates: usar (date as any)?.toDate() | date:'format'
- [x] Agregar checks null para propiedades opcionales en postulaciones.component.ts (ofertaTitulo, empresaNombre)
- [x] Agregar checks null para postulaciones y vacantes en ofertas-list.component.ts
- [x] Agregar check null para postulaciones en oferta-detail.component.ts
- [x] Agregar check null para sector en empresas-list.component.ts (ya implementado con *ngIf en template)
- [x] Verificar que todos los errores estén resueltos ejecutando ng build

# TODO: Arreglar Errores de Compilación

## Pasos a Completar

- [ ] Agregar propiedades faltantes (fechaCreacion, userId) a los objetos Empresa en empresas.service.ts
- [ ] Cambiar 'categoriaOferta' por 'categoria' en empresa-detail.component.ts
- [ ] Cambiar CategoriaOfertaPipe por CategoriaPipe en imports de home.component.ts y oferta-detail.component.ts
- [ ] Agregar totalPostulaciones al objeto stats en estadisticas.component.ts
- [ ] Corregir uso de toDate en templates: usar (date as any)?.toDate() | date:'format'
- [ ] Agregar checks null para propiedades opcionales en postulaciones.component.ts (ofertaTitulo, empresaNombre)
- [ ] Agregar checks null para postulaciones y vacantes en ofertas-list.component.ts
- [ ] Agregar check null para postulaciones en oferta-detail.component.ts
- [ ] Agregar check null para sector en empresas-list.component.ts
- [ ] Verificar que todos los errores estén resueltos ejecutando ng build

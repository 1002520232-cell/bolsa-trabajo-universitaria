# TODO: Implementar Panel de Administración

## Pasos a Completar

### 1. Actualizar Modelos
- [ ] Agregar campo 'aprobada' a Empresa model
- [ ] Agregar campo 'aprobada' a OfertaLaboral model

### 2. Crear Guard de Admin
- [ ] Crear admin.guard.ts para verificar rol de admin

### 3. Crear Componentes de Admin
- [ ] Crear admin.component.ts (principal)
- [ ] Crear admin-dashboard.component.ts
- [x] Crear admin-empresas.component.ts (aprobar empresas)
- [ ] Crear admin-ofertas.component.ts (aprobar ofertas)
- [ ] Crear admin-usuarios.component.ts (gestionar usuarios)
- [ ] Crear admin-postulaciones.component.ts (ver todas las postulaciones)
- [ ] Crear admin-estadisticas.component.ts (estadísticas globales)

### 4. Actualizar Rutas
- [ ] Agregar rutas de admin en app.routes.ts

### 5. Actualizar Servicios
- [ ] Agregar métodos de admin en auth.service.ts (getAllUsers)
- [ ] Agregar métodos de admin en empresas.service.ts (approveEmpresa, getEmpresasPendientes)
- [ ] Agregar métodos de admin en ofertas.service.ts (approveOferta, getOfertasPendientes)
- [ ] Agregar métodos de admin en postulaciones.service.ts (getAllPostulaciones)

### 6. Actualizar Navbar
- [ ] Mostrar enlace de admin para usuarios con rol admin

### 7. Actualizar Estadísticas
- [ ] Modificar estadisticas.component.ts para mostrar globales si es admin

### 8. Pruebas
- [ ] Probar funcionalidades de admin

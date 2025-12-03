# TODO: Agregar Inicio de Sesión con Google y Recuperación de Cuenta

## Información Recopilada
- Proyecto Angular con Firebase Auth y Firestore
- AuthService maneja autenticación con email/password
- Login component tiene formulario de email/password
- Firebase ya está configurado en app.config.ts

## Plan de Implementación
- [ ] Agregar método `loginWithGoogle()` en AuthService
- [ ] Agregar método `resetPassword()` en AuthService
- [ ] Actualizar LoginComponent para incluir botón de Google y enlace de recuperación
- [ ] Manejar usuarios nuevos de Google (crear perfil en Firestore)
- [ ] Probar integración

## Archivos a Modificar
- `src/app/core/services/auth.service.ts`: Agregar métodos de Google y reset password
- `src/app/pages/login/login.component.ts`: Agregar UI para Google login y recuperación
- `src/app/pages/login/login.component.html`: Actualizar template (si existe separado)

## Dependencias
- Ya tiene @angular/fire instalado
- No se necesitan nuevas dependencias

## Pasos de Seguimiento
- [ ] Configurar Google Auth Provider en Firebase Console (requiere credenciales)
- [ ] Probar login con Google
- [ ] Probar recuperación de contraseña
- [ ] Verificar que usuarios de Google se guarden correctamente en Firestore

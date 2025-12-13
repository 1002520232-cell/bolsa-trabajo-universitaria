# BolsaTrabajoUniversitaria

## Descripción del Proyecto

BolsaTrabajoUniversitaria es una plataforma web diseñada para conectar estudiantes universitarios con empresas, facilitando la búsqueda de oportunidades laborales, prácticas profesionales y empleos. La aplicación permite a los usuarios explorar ofertas de trabajo, postularse a ellas, gestionar perfiles y acceder a recursos de aprendizaje.

## Tecnologías y Herramientas Utilizadas

- **Frontend**: Angular 18 (TypeScript, RxJS)
- **Backend**: Firebase (Authentication, Firestore Database, Hosting)
- **UI/UX**: Bootstrap 5, Bootstrap Icons
- **Herramientas de Desarrollo**: Angular CLI, ESLint, Karma, Jasmine
- **Control de Versiones**: Git
- **Despliegue**: Firebase Hosting

## Requisitos para Instalar y Ejecutar

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm (viene con Node.js)
- Angular CLI (`npm install -g @angular/cli`)
- Firebase CLI (`npm install -g firebase-tools`)

### Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/bolsa-trabajo-universitaria.git
   cd bolsa-trabajo-universitaria
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura Firebase:
   - Crea un proyecto en Firebase Console
   - Habilita Authentication y Firestore
   - Copia las credenciales en `src/environments/environment.ts`

4. Ejecuta la aplicación en modo desarrollo:
   ```bash
   ng serve
   ```
   Navega a `http://localhost:4200/`.

### Construcción para Producción
```bash
ng build --configuration production
firebase deploy
```

## Arquitectura del Proyecto

### Componentes Principales
- **Páginas (Pages)**: Home, Login, Register, Dashboard, Ofertas, Empresas, Perfil de Usuario, etc.
- **Componentes Compartidos (Shared)**: Navbar, Breadcrumbs, Loading Spinner, Notifications, Theme Toggle, etc.
- **Directivas y Pipes**: Highlight, Categoria, Estado, Filter, etc.

### Servicios (Services)
- **AuthService**: Manejo de autenticación con Firebase Auth
- **OfertasService**: Gestión de ofertas laborales en Firestore
- **EmpresasService**: Administración de empresas
- **PostulacionesService**: Manejo de postulaciones
- **NotificationsService**: Sistema de notificaciones
- **StorageService**: Almacenamiento de archivos
- **ThemeService**: Gestión de temas (claro/oscuro)

### Guards
- **AuthGuard**: Protege rutas que requieren autenticación
- **RoleGuard**: Controla acceso basado en roles (usuario, empresa, admin)
- **HomeGuard**: Redirige usuarios autenticados desde la página de inicio

### Modelos (Models)
- **Usuario**: Información de usuarios (estudiantes, empresas, admins)
- **OfertaLaboral**: Detalles de ofertas de trabajo
- **Empresa**: Información de empresas
- **Postulacion**: Registros de postulaciones

## URL de Firebase Hosting

La aplicación está desplegada en: [https://bolsa-trabajo-universita-d3e7f.firebaseapp.com](https://bolsa-trabajo-universita-d3e7f.firebaseapp.com)

## Video de Demostración

[URL del video de demostración (5-8 minutos)](https://example.com/video-demo)

El video muestra:
- Funcionalidades principales de la aplicación
- Flujo de autenticación (registro e inicio de sesión)
- Registro y lectura de datos en Firestore
- Explicación breve del código (componentes, servicios y guards)

## Manual de Usuario

### Registro e Inicio de Sesión
1. Accede a la página de inicio y haz clic en "Registrarse".
2. Completa el formulario con tus datos personales.
3. Verifica tu correo electrónico.
4. Inicia sesión con tu email y contraseña.

### Explorar Ofertas
1. Desde la página principal, haz clic en "Ver Ofertas".
2. Filtra por categoría, ubicación o modalidad.
3. Haz clic en una oferta para ver detalles.
4. Postúlate si cumples los requisitos.

### Gestionar Perfil
1. Accede a "Perfil de Usuario" desde el menú.
2. Actualiza tu información personal y CV.
3. Revisa tus postulaciones activas.

### Para Empresas
1. Regístrate como empresa.
2. Publica ofertas de trabajo desde "Mis Ofertas".
3. Gestiona postulaciones recibidas.

### Para Administradores
1. Accede al panel de administración.
2. Gestiona usuarios, empresas y estadísticas.

### Recursos Adicionales
- Videos de aprendizaje disponibles en la sección "Videos de Aprendizaje".
- Estadísticas y métricas en la sección correspondiente.

Para soporte técnico, contacta al equipo de desarrollo.

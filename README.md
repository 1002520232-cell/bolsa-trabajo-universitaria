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
   git clone https://github.com/1002520232-cell/bolsa-trabajo-universitaria.git
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

#### Páginas (Pages)
Cada página representa una vista específica de la aplicación, implementada como componentes standalone de Angular.

- **Home (`/home`)**: Página de inicio con información general de la plataforma, estadísticas y acceso rápido a funcionalidades principales.
  - **Función**: Presenta la bienvenida, métricas del sistema y navegación hacia secciones clave.
  - **Manual de Usuario**: Al acceder, el usuario ve un resumen de ofertas activas, empresas registradas y videos disponibles. Puede navegar directamente a explorar ofertas o registrarse.

- **Login (`/login`)**: Formulario de inicio de sesión.
  - **Función**: Autentica usuarios existentes mediante email y contraseña usando Firebase Auth.
  - **Manual de Usuario**: Ingresa tu email y contraseña registrados. Si olvidaste tu contraseña, usa "Olvidé mi contraseña". Después del login exitoso, serás redirigido al dashboard.

- **Register (`/register`)**: Formulario de registro de nuevos usuarios.
  - **Función**: Crea cuentas nuevas para estudiantes, empresas o administradores con validación de datos.
  - **Manual de Usuario**: Completa todos los campos requeridos. Selecciona tu rol (estudiante/empresa). Verifica tu email antes de poder iniciar sesión.

- **Dashboard (`/dashboard`)**: Panel principal del usuario autenticado.
  - **Función**: Muestra métricas personales, postulaciones activas y accesos rápidos a funciones principales según el rol del usuario.
  - **Manual de Usuario**: Desde aquí puedes ver tus postulaciones pendientes, acceder a tu perfil, publicar ofertas (si eres empresa) o explorar nuevas oportunidades.

- **Ofertas List (`/ofertas`)**: Lista de ofertas laborales disponibles.
  - **Función**: Muestra todas las ofertas activas con filtros y búsqueda.
  - **Manual de Usuario**: Usa los filtros por categoría, ubicación o modalidad. Haz clic en cualquier oferta para ver detalles completos y postularte.

- **Oferta Detail (`/ofertas/:id`)**: Vista detallada de una oferta específica.
  - **Función**: Muestra información completa de la oferta, empresa y permite postularse.
  - **Manual de Usuario**: Revisa los requisitos y descripción. Si cumples los criterios, haz clic en "Postularme" para enviar tu aplicación.

- **Oferta Form (`/ofertas-form`)**: Formulario para crear/editar ofertas laborales.
  - **Función**: Permite a empresas publicar nuevas ofertas o editar existentes.
  - **Manual de Usuario**: Completa todos los campos obligatorios (título, descripción, requisitos, etc.). Puedes guardar como borrador o publicar directamente.

- **Empresas List (`/empresas`)**: Directorio de empresas registradas.
  - **Función**: Lista todas las empresas con información básica y enlace a perfiles detallados.
  - **Manual de Usuario**: Explora empresas por sector. Haz clic en una empresa para ver sus ofertas disponibles y detalles de contacto.

- **Empresa Detail (`/empresas/:id`)**: Perfil detallado de una empresa.
  - **Función**: Muestra información completa de la empresa y sus ofertas activas.
  - **Manual de Usuario**: Revisa la descripción de la empresa y explora sus ofertas laborales disponibles.

- **Empresa Form (`/empresas-form`)**: Formulario de registro/edición de empresas.
  - **Función**: Permite registrar nuevas empresas o actualizar información existente.
  - **Manual de Usuario**: Completa el perfil de tu empresa con logo, descripción, sector y datos de contacto.

- **Postulaciones (`/mis-postulaciones`)**: Lista de postulaciones del usuario.
  - **Función**: Muestra el estado de todas las postulaciones realizadas.
  - **Manual de Usuario**: Revisa el progreso de tus aplicaciones. Los estados incluyen: pendiente, en revisión, aceptada, rechazada.

- **Mis Ofertas (`/mis-ofertas`)**: Gestión de ofertas publicadas (para empresas).
  - **Función**: Lista y administra ofertas creadas por la empresa.
  - **Manual de Usuario**: Edita ofertas existentes, ve postulaciones recibidas, o crea nuevas ofertas.

- **User Profile (`/user-profile`)**: Perfil del usuario.
  - **Función**: Gestión de información personal, CV y preferencias.
  - **Manual de Usuario**: Actualiza tus datos personales, sube tu CV, cambia contraseña y configura notificaciones.

- **Estadísticas (`/estadisticas`)**: Métricas y análisis de la plataforma.
  - **Función**: Muestra estadísticas de uso, ofertas y usuarios.
  - **Manual de Usuario**: Explora gráficos de ofertas por categoría, postulaciones por mes, etc.

- **Videos de Aprendizaje (`/videos-aprendizaje`)**: Biblioteca de videos educativos.
  - **Función**: Proporciona recursos de aprendizaje para estudiantes.
  - **Manual de Usuario**: Navega por categorías de videos. Haz clic en cualquier video para reproducirlo.

- **Admin Dashboard (`/admin/dashboard`)**: Panel de administración.
  - **Función**: Gestión completa del sistema para administradores.
  - **Manual de Usuario**: Administra usuarios, empresas, ofertas y ve estadísticas globales.

#### Componentes Compartidos (Shared)

- **Navbar**: Barra de navegación principal.
  - **Función**: Proporciona navegación global, menú de usuario y acceso a funciones principales.
  - **Manual de Usuario**: Usa los enlaces para navegar. El menú desplegable muestra opciones según tu rol (dashboard, perfil, etc.).

- **Breadcrumbs**: Migas de pan para navegación.
  - **Función**: Muestra la ruta actual y permite navegación hacia atrás.
  - **Manual de Usuario**: Haz clic en cualquier elemento para volver a secciones anteriores.

- **Loading Spinner**: Indicador de carga.
  - **Función**: Muestra progreso durante operaciones asíncronas.
  - **Manual de Usuario**: Aparece automáticamente durante cargas; espera a que termine.

- **Notifications**: Sistema de notificaciones.
  - **Función**: Muestra mensajes de éxito, error o información al usuario.
  - **Manual de Usuario**: Las notificaciones aparecen en la esquina superior derecha y se cierran automáticamente.

- **Oferta Card**: Tarjeta para mostrar ofertas en listas.
  - **Función**: Presenta información resumida de ofertas con enlace a detalles.
  - **Manual de Usuario**: Haz clic en la tarjeta para ver la oferta completa.

- **Theme Toggle**: Alternador de tema claro/oscuro.
  - **Función**: Cambia entre temas de la interfaz.
  - **Manual de Usuario**: Haz clic en el ícono de luna/sol para cambiar el tema.

- **Toast Container**: Contenedor para mensajes temporales.
  - **Función**: Muestra notificaciones no intrusivas.
  - **Manual de Usuario**: Los mensajes aparecen brevemente y desaparecen solos.

#### Directivas y Pipes

- **Highlight Directive**: Resalta texto específico.
  - **Función**: Aplica estilos de resaltado a elementos coincidentes.

- **Categoria Pipe**: Formatea categorías de ofertas.
  - **Función**: Convierte códigos de categoría en nombres legibles.

- **Estado Pipe**: Formatea estados de postulaciones.
  - **Función**: Convierte códigos de estado en textos descriptivos.

- **Filter Pipe**: Filtra listas de elementos.
  - **Función**: Aplica filtros de búsqueda en tiempo real a arrays.

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

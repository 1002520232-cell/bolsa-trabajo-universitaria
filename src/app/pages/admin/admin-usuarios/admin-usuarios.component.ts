import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../../../core/models/usuario.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-usuarios-container">
      <div class="header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra todos los usuarios registrados en la plataforma</p>
      </div>

      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-info">
            <h3>{{ (usuarios$ | async)?.length || 0 }}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon admin">
            <i class="bi bi-shield-check"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getAdminCount() }}</h3>
            <p>Administradores</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon user">
            <i class="bi bi-person"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getUserCount() }}</h3>
            <p>Usuarios</p>
          </div>
        </div>
      </div>

      <div class="filters">
        <div class="filter-tabs">
          <button
            class="filter-tab"
            [class.active]="activeFilter === 'all'"
            (click)="setFilter('all')">
            Todos
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter === 'admin'"
            (click)="setFilter('admin')">
            Administradores
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter === 'non-admin'"
            (click)="setFilter('non-admin')">
            Usuarios
          </button>
        </div>
      </div>

      <div class="usuarios-grid">
        <div
          *ngFor="let usuario of filteredUsuarios"
          class="usuario-card"
          [class.admin]="usuario.rol === 'admin'"
          [class.user]="usuario.rol !== 'admin'">

          <div class="usuario-header">
            <div class="usuario-avatar">
              {{ usuario.nombre.charAt(0) }}{{ usuario.apellido.charAt(0) }}
            </div>
            <div class="usuario-info">
              <h3>{{ usuario.nombre }} {{ usuario.apellido }}</h3>
              <p>{{ usuario.email }}</p>
              <span class="role-badge" [class]="usuario.rol">
                <i class="bi" [class]="usuario.rol === 'admin' ? 'bi-shield-check' : 'bi-person'"></i>
                {{ usuario.rol === 'admin' ? 'Administrador' : (usuario.rol === 'estudiante' ? 'Estudiante' : 'Empresa') }}
              </span>
            </div>
          </div>

          <div class="usuario-details">
            <p><strong>Teléfono:</strong> {{ usuario.telefono || 'No especificado' }}</p>
            <p><strong>Fecha de registro:</strong> {{ usuario.createdAt | date:'dd/MM/yyyy' }}</p>
            <p><strong>Última conexión:</strong> {{ usuario.updatedAt | date:'dd/MM/yyyy HH:mm' }}</p>
          </div>

          <div class="usuario-actions">
            <button
              class="btn-edit"
              (click)="editUsuario(usuario.uid!)">
              <i class="bi bi-pencil"></i>
              Editar
            </button>
            <button
              class="btn-toggle-role"
              (click)="toggleRole(usuario.uid!, usuario.rol)">
              <i class="bi bi-arrow-repeat"></i>
              {{ usuario.rol === 'admin' ? 'Quitar Admin' : 'Hacer Admin' }}
            </button>
            <button
              class="btn-delete"
              (click)="deleteUsuario(usuario.uid!)">
              <i class="bi bi-trash"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-usuarios-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #666;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .stat-icon.admin {
      background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
    }

    .stat-icon.user {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #333;
    }

    .stat-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .filters {
      margin-bottom: 2rem;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      background: #f5f5f5;
      padding: 0.5rem;
      border-radius: 8px;
    }

    .filter-tab {
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      color: #666;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-tab.active {
      background: white;
      color: #333;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .usuarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .usuario-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .usuario-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .usuario-card.admin {
      border-left: 4px solid #ffd700;
    }

    .usuario-card.user {
      border-left: 4px solid #4facfe;
    }

    .usuario-header {
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .usuario-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      color: white;
      border: 3px solid rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
    }

    .usuario-info {
      flex: 1;
    }

    .usuario-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .usuario-info p {
      margin: 0 0 0.5rem 0;
      color: #666;
    }

    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .role-badge.admin {
      background: rgba(255, 215, 0, 0.1);
      color: #f57c00;
    }

    .role-badge.user {
      background: rgba(79, 172, 254, 0.1);
      color: #1976d2;
    }

    .usuario-details {
      padding: 0 1.5rem;
      margin-bottom: 1rem;
    }

    .usuario-details p {
      margin: 0.5rem 0;
      color: #555;
      font-size: 0.9rem;
    }

    .usuario-actions {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-edit, .btn-toggle-role, .btn-delete {
      flex: 1;
      min-width: 100px;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      font-size: 0.8rem;
    }

    .btn-edit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-edit:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-toggle-role {
      background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%);
      color: white;
    }

    .btn-toggle-role:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
    }

    .btn-delete {
      background: linear-gradient(135deg, #ef5350 0%, #d32f2f 100%);
      color: white;
    }

    .btn-delete:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 83, 80, 0.3);
    }

    @media (max-width: 768px) {
      .admin-usuarios-container {
        padding: 1rem;
      }

      .usuarios-grid {
        grid-template-columns: 1fr;
      }

      .stats-cards {
        grid-template-columns: 1fr;
      }

      .usuario-actions {
        flex-direction: column;
      }

      .btn-edit, .btn-toggle-role, .btn-delete {
        min-width: auto;
      }
    }
  `]
})
export class AdminUsuariosComponent implements OnInit {
  private authService = inject(AuthService);

  usuarios$: Observable<Usuario[]> = this.authService.getAllUsers();
  activeFilter: 'all' | 'admin' | 'non-admin' = 'all';
  filteredUsuarios: Usuario[] = [];

  ngOnInit() {
    this.usuarios$.subscribe(usuarios => {
      this.filteredUsuarios = usuarios;
      this.applyFilter();
    });
  }

  setFilter(filter: 'all' | 'admin' | 'non-admin') {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter() {
    this.usuarios$.subscribe(usuarios => {
      switch (this.activeFilter) {
        case 'admin':
          this.filteredUsuarios = usuarios.filter(u => u.rol === 'admin');
          break;
        case 'non-admin':
          this.filteredUsuarios = usuarios.filter(u => u.rol !== 'admin');
          break;
        default:
          this.filteredUsuarios = usuarios;
      }
    });
  }

  getAdminCount(): number {
    return this.filteredUsuarios.filter(u => u.rol === 'admin').length;
  }

  getUserCount(): number {
    return this.filteredUsuarios.filter(u => u.rol !== 'admin').length;
  }

  editUsuario(usuarioId: string) {
    // TODO: Implement edit functionality
    console.log('Editando usuario:', usuarioId);
  }

  async toggleRole(usuarioId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'estudiante' : 'admin';
    if (confirm(`¿Estás seguro de cambiar el rol de este usuario a ${newRole}?`)) {
      try {
        await this.authService.updateUserProfile(usuarioId, { rol: newRole });
        alert('Rol actualizado exitosamente');
        // Refresh the list
        this.ngOnInit();
      } catch (error) {
        console.error('Error al actualizar rol:', error);
        alert('Error al actualizar el rol');
      }
    }
  }

  deleteUsuario(usuarioId: string) {
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      // TODO: Implement delete functionality
      console.log('Eliminando usuario:', usuarioId);
    }
  }
}

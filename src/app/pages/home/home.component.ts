// src/app/pages/home/home.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfertasService } from '../../core/services/ofertas.service';
import { EmpresasService } from '../../core/services/empresas.service';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';
import { Empresa } from '../../core/models/empresa.model';
import { CategoriaPipe } from '../../shared/pipes/categoria.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoriaPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private ofertasService = inject(OfertasService);
  private empresasService = inject(EmpresasService);
  ofertas: OfertaLaboral[] = [];
  empresas: Empresa[] = [];

  ngOnInit(): void {
    this.ofertasService.getOfertas().subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
      },
      error: (error) => console.error('Error al cargar ofertas:', error)
    });

    this.empresasService.getEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
      },
      error: (error) => console.error('Error al cargar empresas:', error)
    });
  }
}

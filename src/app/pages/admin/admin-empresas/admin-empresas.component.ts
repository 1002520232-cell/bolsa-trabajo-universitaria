  async approveEmpresa(empresaId: string) {
    if (confirm('¿Estás seguro de que deseas aprobar esta empresa?')) {
      try {
        await this.empresasService.approveEmpresa(empresaId);
        alert('Empresa aprobada exitosamente');
        // Refresh the list
        this.ngOnInit();
      } catch (error) {
        console.error('Error al aprobar empresa:', error);
        alert('Error al aprobar la empresa');
      }
    }
  }

  async rejectEmpresa(empresaId: string) {
    if (confirm('¿Estás seguro de que deseas rechazar esta empresa?')) {
      try {
        await this.empresasService.rejectEmpresa(empresaId);
        alert('Empresa rechazada exitosamente');
        // Refresh the list
        this.ngOnInit();
      } catch (error) {
        console.error('Error al rechazar empresa:', error);
        alert('Error al rechazar la empresa');
      }
    }
  }
=======
  async approveEmpresa(empresaId: string) {
    if (confirm('¿Estás seguro de que deseas aprobar esta empresa?')) {
      try {
        await this.empresasService.approveEmpresa(empresaId);
        alert('Empresa aprobada exitosamente');
        // Refresh the list
        this.ngOnInit();
      } catch (error) {
        console.error('Error al aprobar empresa:', error);
        alert('Error al aprobar la empresa');
      }
    }
  }

  async rejectEmpresa(empresaId: string) {
    if (confirm('¿Estás seguro de que deseas rechazar esta empresa?')) {
      try {
        await this.empresasService.rejectEmpresa(empresaId);
        alert('Empresa rechazada exitosamente');
        // Refresh the list
        this.ngOnInit();
      } catch (error) {
        console.error('Error al rechazar empresa:', error);
        alert('Error al rechazar la empresa');
      }
    }
  }

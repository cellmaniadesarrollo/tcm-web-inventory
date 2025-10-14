import { Component } from '@angular/core';
import { ReportsCelularesService } from 'src/app/service/reports-celulares/reports-celulares.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-repots-all',
  templateUrl: './repots-all.component.html',
  styleUrls: ['./repots-all.component.css']
})
export class RepotsAllComponent {
  loading = false;

  constructor(private apibackend: ReportsCelularesService) {}

  ngOnInit(): void {
    // Si quieres precargar algo aquí
  }

  // 🧾 Reporte de stock
  async verReporteStockCelulares() {
    this.loading = true;
    try {
      const response = await this.apibackend.getReportStockCelulares();
      this.mostrarPDF(response);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    } finally {
      this.loading = false;
    }
  }

  // 🧾 Reporte de celulares vendidos (abre modal)
 async verReporteCelularesVendidos() {
    // 📅 Obtener el primer y último día del mes anterior
    const hoy = new Date();
    const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    // 🔹 Convertir a formato YYYY-MM-DD para los inputs tipo "date"
    const formatoFecha = (fecha: Date) => fecha.toISOString().split('T')[0];
    const fechaInicioDefault = formatoFecha(primerDiaMesAnterior);
    const fechaFinDefault = formatoFecha(ultimoDiaMesAnterior);

    const { value: fechas } = await Swal.fire({
      title: '📅 Selecciona el rango de fechas',
      html: `
        <div class="d-flex flex-column align-items-start gap-2">
          <label>Fecha inicio:</label>
          <input type="date" id="fechaInicio" class="swal2-input" style="width:auto" value="${fechaInicioDefault}">
          <label>Fecha fin:</label>
          <input type="date" id="fechaFin" class="swal2-input" style="width:auto" value="${fechaFinDefault}">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const fechaInicio = (document.getElementById('fechaInicio') as HTMLInputElement).value;
        const fechaFin = (document.getElementById('fechaFin') as HTMLInputElement).value;

        if (!fechaInicio || !fechaFin) {
          Swal.showValidationMessage('⚠️ Debes seleccionar ambas fechas');
          return false;
        }
        return { fechaInicio, fechaFin };
      }
    });

    if (fechas) {
      this.generarReporteVendidos(fechas.fechaInicio, fechas.fechaFin);
    }
  }

  // 🔹 Lógica para consumir el backend con fechas
  async generarReporteVendidos(fechaInicio: string, fechaFin: string) {
    this.loading = true;
    try {
      const response = await this.apibackend.getReportCelularesVendidos({fechaInicio, fechaFin});
      this.mostrarPDF(response);
    } catch (error) {
      console.error('Error al generar reporte de vendidos:', error);
      Swal.fire('Error', 'No se pudo generar el reporte', 'error');
    } finally {
      this.loading = false;
    }
  }

  // 🔹 Muestra el PDF recibido (base64)
  mostrarPDF(base64PDF: string) {
    const byteCharacters = atob(base64PDF);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }


}

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private toast: ToastrService,private toast2: NgToastService) {}

  showSuccess(texto:any, titulo:any) {
    console.log('titulo',titulo)
  //  Swal.fire({ 
  //   position: "top-end",
  //   icon: "success",
  //   title: titulo,
  //   text: texto,
  //   showConfirmButton: false,
  //   timer: 2500
  // });
   // this.toast2.success({detail:titulo,summary:texto,duration:2000});
     this.toast.success(texto,  (typeof titulo === 'object') ? '' : titulo);
  }
  showError(texto:any, titulo:any, tiempo?: number) {
    // Swal.fire({
    //   position: "top-end",
    //   icon: "error",
    //   title: titulo,
    //   text: texto,
    //   showConfirmButton: false,
    //   timer: 2500,
    //   width: '300px'
    // });
  // this.toast2.error({detail:titulo,summary:texto,duration:2000});
     this.toast.error(texto,   (typeof titulo === 'object') ? '' : titulo ,  {
      timeOut: tiempo ?? 5000, // si no mandas tiempo usa 5000 por defecto
      extendedTimeOut: 2000,   // cuánto tiempo se queda si pasas el mouse encima
      closeButton: true,       // para mostrar botón de cerrar
      progressBar: true        // opcional: barra de progreso
    });
  }
}

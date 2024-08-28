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
   //console.log(texto)
   Swal.fire({ 
    position: "top-end",
    icon: "success",
    title: titulo,
    text: texto,
    showConfirmButton: false,
    timer: 2500
  });
   //this.toast2.success({detail:titulo,summary:texto,duration:2000});
   // this.toast.success(texto, titulo);
  }
  showError(texto:any, titulo:any) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: titulo,
      text: texto,
      showConfirmButton: false,
      timer: 2500,
      width: '300px'
    });
  //  this.toast2.error({detail:titulo,summary:texto,duration:2000});
   // this.toast.error(texto, titulo);
  }
}

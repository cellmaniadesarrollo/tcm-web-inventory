import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../app/service/api/api.service';
import { event } from 'jquery';
import { SetdataService } from './service/setdata/setdata.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr'
import { SocketnotiService } from './service/socketnoti/socketnoti.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  constructor(private setdataService: SetdataService, private router: Router, private api: ApiService, private toastr: ToastrService, private socketService: SocketnotiService) { }
  private lastTime: number = 0;
  private inputBuffer: string = '';
  lastKeyTime: number = 0;
  timeDifference: number = 0;
  timeoutId: any;
  timeoutDuration: number = 300;
  private messageSubscription: Subscription | null = null;
  ngOnInit() {
    this.showCustomToast()
    // Suscribirse al canal al iniciar el componente
    this.socketService.subscribeToChannel('notification');

    // Suscribirse al observable de mensajes para recibir los mensajes del canal
    this.messageSubscription = this.socketService.message$.subscribe((message) => {
      const data = JSON.parse(message || '{}')
      if (data.title) {

        this.toastr.info(data.message , data.title, { 
          timeOut: 0,
          progressBar: true,
          tapToDismiss: false,
          positionClass: 'toast-top-right',
          closeButton: true,
          extendedTimeOut: 0,
        });

      }
    });
    window.addEventListener('focus', () => {
      if (!this.esRutaLogin()) { this.api.controltoken(); }

    });
  }

  showCustomToast() {

  }



  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {

    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastTime;

    if (this.lastKeyTime !== 0) {
      this.timeDifference = currentTime - this.lastKeyTime;
    }
    this.lastKeyTime = currentTime;
    this.resetTimeout();
    if (this.isValidCharacter(event)) {
      this.inputBuffer += event.key;
    }
  }
  private isValidCharacter(event: KeyboardEvent): boolean {
    return !event.ctrlKey && !event.altKey && !event.metaKey &&
      event.key.length === 1 && event.key !== 'Enter' && event.key !== '"';
  }

  resetTimeout() {
    // Cancela cualquier temporizador anterior
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Inicia un nuevo temporizador
    this.timeoutId = setTimeout(() => {
      this.printConstant();
    }, this.timeoutDuration);
  }

  printConstant() {
    if (this.inputBuffer.length === 29) {
      this.find(this.inputBuffer)
    } else if (this.inputBuffer.length > 29) {
      // Expresiones regulares para encontrar los valores de D y B
      const matchD = this.inputBuffer.match(/D:\s*([^,]*)/);
      const matchB = this.inputBuffer.match(/B:\s*(\w+)/);

      // Extraer los valores encontrados
      const valueD = matchD ? matchD[1].trim() : '';
      const valueB = matchB ? matchB[1].trim() : 'false';
      this.find(valueD, this.stringToBoolean(valueB))
    }

    this.inputBuffer = ""
  }
  stringToBoolean(value: string): boolean {
    try {
      return value.toLowerCase() === 'true';
    } catch (error) {
      return false
    }

  }
  async find(data: any, income: boolean = false) {
    const item = await this.api.findinventoryitem({ dat: data, inc: income })
    if (item.inventory_name === 'INVENTORYFLOW') {
      this.setdataService.setData(item.sku)
      // Navegar a una ruta temporal y luego de vuelta a /inventory
      this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/inventory']);
      });
      //this.router.navigate(['/inventory', item.sku]);
    } else if (item.inventory_name === 'INVENTORYPER') {
      this.setdataService.setData(item.sku)
      // Navegar a una ruta temporal y luego de vuelta a /inventory
      this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/inventoryper']);
      });
    }


    console.log(item)
  }
  esRutaLogin(): boolean {
    return this.router.url === '/login';
  }

}

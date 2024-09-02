import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../app/service/api/api.service';
import { event } from 'jquery';
import { SetdataService } from './service/setdata/setdata.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private setdataService: SetdataService ,private router: Router, private api: ApiService,) { }
  private lastTime: number = 0;
  private inputBuffer: string = ''; 
  lastKeyTime: number = 0;
  timeDifference: number = 0;
  timeoutId: any;
  timeoutDuration: number = 300;
  ngOnInit() {
    console.log(environment.apiUrl ) 
    window.addEventListener('focus', () => {
      if (!this.esRutaLogin()) { this.api.controltoken(); }

    });
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
      event.key.length === 1 && event.key !== 'Enter'&& event.key !== '"';
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
   const item= await this.api.findinventoryitem({ dat: data, inc: income })
   if(item.inventory_name==='INVENTORYFLOW'){
    this.setdataService.setData(item.sku )
        // Navegar a una ruta temporal y luego de vuelta a /inventory
        this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/inventory']);
        });
    //this.router.navigate(['/inventory', item.sku]);
   }else if(item.inventory_name==='INVENTORYPER'){
    this.setdataService.setData(item.sku )
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

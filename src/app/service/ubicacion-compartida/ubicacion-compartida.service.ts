import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UbicacionCompartidaService {
  // Datos iniciales
  private coordenadasIniciales = {
    latitud: 0,
    longitud: 0
  };

  private nombreSucursalInicial = 'DESCONOCIDA';

  // Subjects para los datos observables
  private coordenadasSubject = new BehaviorSubject<any>(this.coordenadasIniciales);
  private nombreSucursalSubject = new BehaviorSubject<string>(this.nombreSucursalInicial);

  // Observables públicos para que los componentes se suscriban
  coordenadas$ = this.coordenadasSubject.asObservable();
  nombreSucursal$ = this.nombreSucursalSubject.asObservable();

  constructor() { }

  // Método para actualizar las coordenadas
  actualizarCoordenadas(coordenadas: { latitud: number, longitud: number }) {
    this.coordenadasSubject.next(coordenadas);
  }

  // Método para actualizar el nombre de la sucursal
  actualizarNombreSucursal(nombre: string) {
    this.nombreSucursalSubject.next(nombre);
  }

  // Método para obtener el valor actual (útil para componentes que no quieren suscribirse)
  getCoordenadasActuales(): { latitud: number, longitud: number } {
    return this.coordenadasSubject.value;
  }

  getNombreSucursalActual(): string {
    return this.nombreSucursalSubject.value;
  }
}

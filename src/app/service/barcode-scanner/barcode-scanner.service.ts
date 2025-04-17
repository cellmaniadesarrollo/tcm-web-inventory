import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService { 
  private buffer = '';
  private lastKeyTime = Date.now();
  private timer: any;
  private readonly TIMEOUT = 150; // tiempo entre teclas para resetear

  constructor(private zone: NgZone) {
    this.listenToKeyboard();
  }

  private keyListeners: ((code: string) => void)[] = [];

  private listenToKeyboard() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this.zone.run(() => {
        const currentTime = Date.now();
        const timeDiff = currentTime - this.lastKeyTime;
        this.lastKeyTime = currentTime;

        if (timeDiff > this.TIMEOUT) {
          this.buffer = '';
        }

        if (event.key.length === 1) {
          this.buffer += event.key;
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          const rawCode = this.buffer;
          this.buffer = '';

          const normalizedCode = this.normalizeCode(rawCode);
          this.emitToListeners(normalizedCode);
        }, this.TIMEOUT);
      });
    });
  }

  private emitToListeners(code: string) {
    for (const listener of this.keyListeners) {
      listener(code);
    }
  }

  /**
   * Escucha escaneos válidos según rango de longitud.
   */
  public listenForScan(minLength: number, maxLength: number): Observable<string> {
    return new Observable<string>((subscriber) => {
      const listener = (code: string) => {
        if (code.length >= minLength && code.length <= maxLength) {
          subscriber.next(code);
        }
      };

      this.keyListeners.push(listener);

      return () => {
        this.keyListeners = this.keyListeners.filter(l => l !== listener);
      };
    });
  }

  /**
   * Reemplaza comillas y símbolos parecidos por guiones.
   */
  private normalizeCode(code: string): string {
    return code
      .replace(/['‘’]/g, '-')  // comillas simples a guiones
      .replace(/[–—]/g, '-')   // guiones largos a guiones normales
      .replace(/\s+/g, '')     // elimina espacios por si acaso
      .trim();
  }
}

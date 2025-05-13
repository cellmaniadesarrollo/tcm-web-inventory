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

        if (this.isPseudoJsonFormat(rawCode)) {
          const parsed = this.parseRawCodeToObject(rawCode);
          const normalizedCode = parsed['S'] || '';
          this.emitToListeners(normalizedCode);
        } else {
          const normalizedCode = this.normalizeCode(rawCode);
          this.emitToListeners(normalizedCode);
        }
      }, this.TIMEOUT);
    });
  });
}

// Detecta si es un formato tipo clave:valor (pseudo JSON)
private isPseudoJsonFormat(str: string): boolean {
  const pairs = str.split(',');
  return pairs.length > 1 && pairs.every(pair => pair.includes(':'));
}

// Convierte el formato clave:valor a un objeto
private parseRawCodeToObject(rawCode: string): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  const entries = rawCode.split(',');

  for (let entry of entries) {
    const [key, ...rest] = entry.split(':');
    if (key && rest.length > 0) {
      result[key.trim()] = rest.join(':').trim();
    }
  }

  return result;
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
//  va a venir de estas dos formas los strings si viene de la segunda seria de devolver solo S la segunda parte seria de convertila en json ya que es un string aplicar filtros 
// PER-AMA-AMA-INS00000000000742
// F: 2025-05-09 ,D:681e22c16efb8d02514005ea,S:INS-APP-ROS-INF00000000002028,P:A. C. L. J. C. B:true, el codigo que te di esta solo para el primer string
import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private webSocketUrl = environment.webSocket;
  private socket: WebSocket | null = null;
  private socketOpenPromise: Promise<void> = Promise.resolve();
  private reconnectDelay = 5000; // Tiempo de espera antes de intentar reconectar (en milisegundos)
  private reconnectSubscription: Subscription | null = null;
  private shouldReconnect = true; // Nueva bandera para controlar la reconexión 
  private reconnectAttempts = 0; // Número de intentos de reconexión
  private maxReconnectAttempts = 5; // Máximo número de intentos de reconexión
  private messageSubject = new BehaviorSubject<string | null>(null);
  public message$ = this.messageSubject.asObservable();

  constructor() {
    
  } 
  private connect() {
    try {
      this.socket = new WebSocket(this.webSocketUrl);

      this.socketOpenPromise = new Promise((resolve, reject) => {
        this.socket!.onopen = () => {
          console.log('WebSocket connection established');
          this.reconnectAttempts = 0; // Reiniciar los intentos al establecer conexión
          this.shouldReconnect = true
          resolve();
          if (this.reconnectSubscription) {
            this.reconnectSubscription.unsubscribe();
            this.reconnectSubscription = null;
          }
        };
  
        this.socket!.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      });
  
      this.socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
        this.messageSubject.next(event.data);  // Emitir el mensaje recibido
      };
  
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnect(); // Intentar reconectar solo si shouldReconnect es true y no se ha alcanzado el límite
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('Max reconnect attempts reached. No further attempts will be made.');
        }
      };
    
    } catch (error) {
      this.shouldReconnect = true
      this.reconnect()
    }
    
  }

  async subscribeToChannel(channel: string) {
    this.connect();
    await this.socketOpenPromise;
    const message = {
      type: 'subscribe',
      channel: channel
    };
    this.sendMessage(message);
  }

  async sendMessageToChannel(channel: string, data: string) {
    await this.socketOpenPromise;
    const message = {
      type: 'message',
      channel: channel,
      data: data
    };
    this.sendMessage(message);
  }

  async unsubscribeFromChannel(channel: string) {
    await this.socketOpenPromise;
    const message = {
      type: 'unsubscribe',
      channel: channel
    };
    this.sendMessage(message);
  }

  closeConnection() {
    this.shouldReconnect = false; // Desactivar reconexión
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket connection manually closed');
    }
  }

  private sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. ReadyState:', this.socket?.readyState);
    }
  }

  private reconnect() {
    this.reconnectAttempts++;
    if (!this.reconnectSubscription) {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay / 1000} seconds...`);
      this.reconnectSubscription = timer(this.reconnectDelay).subscribe(() => {
        this.connect(); // Intentar reconectar
      });
    }
  }
}

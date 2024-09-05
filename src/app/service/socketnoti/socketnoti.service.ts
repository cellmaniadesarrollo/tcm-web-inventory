import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketnotiService {
  private webSocketUrl = environment.webSocket;
  private socket: WebSocket | null = null;
  private socketOpenPromise: Promise<void> = Promise.resolve();
  private currentChannel: string | null = null; // Canal actual
  private messageSubject = new BehaviorSubject<string | null>(null);
  public message$ = this.messageSubject.asObservable();

  private predefinedChannel = 'notification'; // Canal predefinido

  constructor() {
    this.connect(); // Iniciar la conexión WebSocket
  }

  private connect() {
    this.socket = new WebSocket(this.webSocketUrl);

    this.socketOpenPromise = new Promise((resolve, reject) => {
      this.socket!.onopen = async () => {
        console.log('WebSocket connection established');
        resolve();
        // Suscribirse automáticamente al canal predefinido
        await this.subscribeToChannel(this.predefinedChannel);
      };

      this.socket!.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      this.messageSubject.next(event.data); // Emitir el mensaje recibido
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  // Función para suscribirse a un canal
  async subscribeToChannel(channel: string) {
    // Desuscribirse del canal anterior si existe
    if (this.currentChannel) {
      await this.unsubscribeFromChannel(this.currentChannel);
    }

    // Conectarse al nuevo canal
    this.currentChannel = channel;
    await this.socketOpenPromise;
    const message = {
      type: 'subscribe',
      channel: channel
    };
    this.sendMessage(message);
    console.log(`Subscribed to channel: ${channel}`);
  }

  // Función para desuscribirse de un canal
  async unsubscribeFromChannel(channel: string) {
    if (!this.currentChannel || this.currentChannel !== channel) {
      return; // Si no está suscrito a este canal, salir
    }

    await this.socketOpenPromise;
    const message = {
      type: 'unsubscribe',
      channel: channel
    };
    this.sendMessage(message);
    this.currentChannel = null;
    console.log(`Unsubscribed from channel: ${channel}`);
  }

  // Función para cerrar manualmente la conexión
  closeConnection() {
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
}

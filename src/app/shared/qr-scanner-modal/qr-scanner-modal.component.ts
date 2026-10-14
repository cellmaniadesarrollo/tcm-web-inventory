import { Component, AfterViewInit, OnDestroy, NgZone, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import jsQR from 'jsqr';

interface CameraOption { id: string; label: string; }

@Component({
  selector: 'app-qr-scanner-modal',
  templateUrl: './qr-scanner-modal.component.html',
  styleUrls: ['./qr-scanner-modal.component.css']
})
export class QrScannerModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private static readonly STORAGE_KEY = 'qr-scanner-camera-id';

  cameras: CameraOption[] = [];
  selectedCameraId: string | null = null;
  errorMessage = '';
  isStarting = true;
  torchSupported = false;
  torchOn = false;

  private stream: MediaStream | null = null;
  private track: MediaStreamTrack | null = null;
  private detector: any = null;
  private rafId = 0;
  private lastScan = 0;
  private busy = false;
  private handled = false;
  private destroyed = false;

  constructor(
    private dialogRef: MatDialogRef<QrScannerModalComponent, string>,
    private zone: NgZone
  ) {}

  async ngAfterViewInit(): Promise<void> {
    if ('BarcodeDetector' in window) {
      try { this.detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] }); }
      catch { this.detector = null; }
    }
    await this.startCamera(this.getSavedCamera());
    await this.loadCameras();
  }

  private async loadCameras(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const list = devices
        .filter(d => d.kind === 'videoinput')
        .map((d, i) => ({ id: d.deviceId, label: d.label || `Cámara ${i + 1}` }));

      this.zone.run(() => {
        this.cameras = list;
        const currentId = this.track?.getSettings?.().deviceId;
        this.selectedCameraId = currentId || list[0]?.id || null;
      });
    } catch { /* usa cámara por defecto */ }
  }

  async onCameraChange(): Promise<void> {
    if (!this.selectedCameraId) return;
    this.saveCamera(this.selectedCameraId);
    this.stopCamera();
    this.isStarting = true;
    await this.startCamera(this.selectedCameraId);
  }

  private async startCamera(deviceId?: string | null): Promise<void> {
    this.errorMessage = '';
    this.torchOn = false;
    this.torchSupported = false;

    const base = { width: { ideal: 1920 }, height: { ideal: 1080 } };

    try {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: deviceId
            ? { ...base, deviceId: { exact: deviceId } }
            : { ...base, facingMode: { ideal: 'environment' } }
        });
      } catch (e: any) {
        if (deviceId && (e?.name === 'OverconstrainedError' || e?.name === 'NotFoundError')) {
          this.stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { ...base, facingMode: { ideal: 'environment' } }
          });
        } else {
          throw e;
        }
      }

      if (this.destroyed) { this.stopCamera(); return; }

      this.track = this.stream.getVideoTracks()[0];
      await this.applyAdvancedConstraints();

      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;
      video.setAttribute('playsinline', 'true');
      video.muted = true;
      await video.play();

      this.zone.run(() => (this.isStarting = false));
      this.handled = false;
      this.zone.runOutsideAngular(() => this.scanLoop());
    } catch (err: any) {
      this.setError(this.mapError(err));
    }
  }

  private async applyAdvancedConstraints(): Promise<void> {
    if (!this.track) return;
    try {
      const caps: any = (this.track as any).getCapabilities?.() || {};
      const advanced: any = {};

      if (caps.focusMode?.includes('continuous')) advanced.focusMode = 'continuous';
      if (caps.zoom) advanced.zoom = Math.min(caps.zoom.max, Math.max(caps.zoom.min, 1.5));

      if (Object.keys(advanced).length) {
        await this.track.applyConstraints({ advanced: [advanced] } as any);
      }
      this.zone.run(() => (this.torchSupported = !!caps.torch));
    } catch { /* no soportado */ }
  }

  async toggleTorch(): Promise<void> {
    if (!this.track || !this.torchSupported) return;
    try {
      this.torchOn = !this.torchOn;
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] } as any);
    } catch { this.torchOn = false; }
  }

  private scanLoop = (): void => {
    if (this.destroyed || this.handled || !this.stream) return;

    const now = performance.now();
    if (!this.busy && now - this.lastScan > 120) {
      this.lastScan = now;
      this.busy = true;
      this.tryDecode().finally(() => (this.busy = false));
    }
    this.rafId = requestAnimationFrame(this.scanLoop);
  };

  private async tryDecode(): Promise<void> {
    const video = this.videoRef.nativeElement;
    if (video.readyState < 2 || !video.videoWidth) return;

    let text: string | null = null;

    if (this.detector) {
      try {
        const codes = await this.detector.detect(video);
        if (codes?.length) text = codes[0].rawValue;
      } catch { /* sigue con jsQR */ }
    }

    if (!text) {
      const canvas = this.canvasRef.nativeElement;
      const scale = Math.min(1, 1280 / video.videoWidth);
      canvas.width = Math.floor(video.videoWidth * scale);
      canvas.height = Math.floor(video.videoHeight * scale);

      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' });
      if (code?.data) text = code.data;
    }

    if (text) this.onScanSuccess(text);
  }

  private onScanSuccess(text: string): void {
    if (this.handled) return;
    this.handled = true;
    if (navigator.vibrate) navigator.vibrate(100);
    this.stopCamera();
    this.zone.run(() => this.dialogRef.close(text));
  }

  private stopCamera(): void {
    cancelAnimationFrame(this.rafId);
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.track = null;
  }

  private getSavedCamera(): string | null {
    try { return localStorage.getItem(QrScannerModalComponent.STORAGE_KEY); } catch { return null; }
  }

  private saveCamera(id: string): void {
    try { localStorage.setItem(QrScannerModalComponent.STORAGE_KEY, id); } catch { /* ignorar */ }
  }

  close(): void {
    this.dialogRef.close();
  }

  private setError(msg: string): void {
    this.zone.run(() => {
      this.errorMessage = msg;
      this.isStarting = false;
    });
  }

  private mapError(err: any): string {
    const name = err?.name || '';
    if (name === 'NotAllowedError') return 'Permiso de cámara denegado. Habilítalo en la configuración del navegador.';
    if (name === 'NotFoundError') return 'No se encontró ninguna cámara.';
    if (name === 'NotReadableError') return 'La cámara está siendo usada por otra aplicación.';
    if (!navigator.mediaDevices) return 'La cámara requiere HTTPS o localhost.';
    return 'No se pudo iniciar la cámara.';
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopCamera();
  }
}
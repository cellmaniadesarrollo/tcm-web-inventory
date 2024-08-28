import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfViewerService {

  constructor() { }
  openPDFInNewTab(pdfBase64: string) {
    const binaryData = atob(pdfBase64);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const byteArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  }
}

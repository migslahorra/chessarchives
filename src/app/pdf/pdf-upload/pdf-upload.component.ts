// pdf-upload.component.ts
import { Component } from '@angular/core';
import { PdfService } from '../pdf.service';

@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.css']
})
export class PdfUploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number | null = null;

  constructor(private pdfService: PdfService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.item(0) || null;
    this.uploadProgress = null;
  }

  uploadPdf() {
    if (this.selectedFile) {
      this.pdfService.uploadPdf(this.selectedFile).subscribe({
        next: (event: any) => {
          if (event.type === 'UPLOAD_PROGRESS') {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.body) {
            alert('Upload complete!');
            this.selectedFile = null;
            this.uploadProgress = null;
          }
        },
        error: () => alert('Upload failed')
      });
    }
  }
}

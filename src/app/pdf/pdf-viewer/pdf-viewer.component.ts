import { Component, OnInit } from '@angular/core';
import { PdfService } from '../pdf.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
  pdfBooks: any[] = [];

  constructor(private pdfService: PdfService) {}

  ngOnInit(): void {
    this.loadPdfs();
  }

  loadPdfs(): void {
    this.pdfService.getPdfs().subscribe({
      next: (pdfs) => this.pdfBooks = pdfs,
      error: () => alert('Failed to load PDFs')
    });
  }

  downloadPdf(storedFilename: string, originalFilename: string) {
  this.pdfService.downloadPdf(storedFilename).subscribe({
    next: (blob) => saveAs(blob, originalFilename),
    error: () => alert('Download failed')
  });
  }
}
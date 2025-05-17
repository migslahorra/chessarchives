// pdf-viewer.component.ts
import { Component, OnInit } from '@angular/core';
import { PdfService } from '../pdf.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
  pdfBooks: any[] = [];

  constructor(private pdfService: PdfService) {}

  ngOnInit() {
    this.loadPdfs();
  }

  loadPdfs() {
    this.pdfService.getPdfs().subscribe({
      next: (pdfs) => this.pdfBooks = pdfs,
      error: () => alert('Failed to load PDFs')
    });
  }

  deletePdf(id: string) {
    if (confirm('Delete this book?')) {
      this.pdfService.deletePdf(id).subscribe({
        next: () => this.loadPdfs(),
        error: () => alert('Deletion failed')
      });
    }
  }
}

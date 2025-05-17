import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private baseUrl: string = 'http://localhost:3000/api/pdfs';  // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Get the list of PDFs (Retrieve metadata or a list of available PDFs)
  getPdfs(): Observable<any> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error fetching PDFs', error);
        throw error;
      })
    );
  }

  // Upload PDF with progress
  uploadPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', file, file.name);

    const uploadReq = new HttpRequest('POST', this.baseUrl, formData, {
      headers: new HttpHeaders(),
      reportProgress: true
    });

    return this.http.request(uploadReq).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            return { type: 'UPLOAD_PROGRESS', loaded: event.loaded, total: event.total };
          case HttpEventType.Response:
            // When the upload is complete, return the file metadata response from the backend
            return event.body; // Returns metadata from MongoDB
          default:
            return event;
        }
      }),
      catchError(error => {
        console.error('Upload failed', error);
        throw error;
      })
    );
  }

  // Delete PDF by ID
  deletePdf(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting PDF', error);
        throw error;
      })
    );
  }
}
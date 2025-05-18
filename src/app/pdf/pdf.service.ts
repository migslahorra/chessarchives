import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private baseUrl: string = 'http://localhost:3000/api/pdfs';

  constructor(private http: HttpClient) {}

  getPdfs(): Observable<any> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error fetching PDFs', error);
        throw error;
      })
    );
  }

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
            return event.body;
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

    downloadPdf(storedFilename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${encodeURIComponent(storedFilename)}`, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Download failed', error);
        throw error;
      })
    );
  }
}

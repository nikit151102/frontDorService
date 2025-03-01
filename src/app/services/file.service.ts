import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CommomFileService {

  constructor(private toastService: ToastService, private http: HttpClient) { }

  fileSizeInMB(fileSizeInBits: string | number): string {
    let bits: number;

    if (typeof fileSizeInBits === 'string') {
      bits = parseFloat(fileSizeInBits);
    } else {
      bits = fileSizeInBits;
    }

    if (isNaN(bits) || bits < 0) {
      return '0.00';
    }

    return (bits / 1024 / 1024).toFixed(2);
  }

  previewfile(fileId: string): Observable<Blob> {
    return this.download(fileId).pipe(
      map((response: { file: any; documentMetadata: any }) => {
        return this.createBlobFromData(response.file);
      })
    );
  }


  downloadFile(fileId: string) {

    this.download(fileId).subscribe((response: { file: any; documentMetadata: any }) => {
      console.log('Получен ответ:', response);
      let blob = this.createBlobFromData(response.file);

      if (response.documentMetadata) {

        const fileName = response.documentMetadata.fileName || 'downloaded-file';
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();

        window.URL.revokeObjectURL(downloadUrl);

      } else {
        this.toastService.showError('Ошибка!', 'Нет файла для скачивания');
      }

    },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      });
  }

  createBlobFromData(fileData: any): Blob {
    if (!fileData.fileContents) {
      return new Blob(); // Возвращаем пустой Blob, если данных нет.
    }

    const byteCharacters = atob(fileData.fileContents); // Декодируем base64
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: fileData.contentType });
  }

  createBlob(fileData: any): Blob {
    return this.createBlobFromData(fileData);

  }
  createBlobUrl(blob: any): any {
    return window.URL.createObjectURL(blob);
  }

  download(id: string): Observable<any> {
    const url = `${environment.apiUrl}/api/Profile/DownloadFile/${id}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<Blob>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'json',
    });
  }

}

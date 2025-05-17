// file-size.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(value: number, ...args: any[]): string {
    if (value < 1024) {
      return value + ' B';
    } else if (value < 1048576) {
      return (value / 1024).toFixed(2) + ' KB';
    } else if (value < 1073741824) {
      return (value / 1048576).toFixed(2) + ' MB';
    } else {
      return (value / 1073741824).toFixed(2) + ' GB';
    }
  }
}

import { Component, Input } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-download-file',
  templateUrl: './download-file.component.html',
  styleUrls: ['./download-file.component.css'],
})

export class DownloadFileComponent {

  @Input() content: Blob;

  @Input() fileName: string;

  @Input() btnText: string;

  download() {
    saveAs(this.content, this.fileName);
  }

}

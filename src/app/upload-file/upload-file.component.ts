import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent {

  @Output() frCompolete: EventEmitter<string> = new EventEmitter();

  fileName: string = '';
  fileSize: string = '';

  uploadFile($event) {
    let file: File = $event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size.toString();
    let fr: FileReader = new FileReader();
    let result: string = '';
    fr.onloadend = (e) => {
      result = fr.result.toString();
      this.frCompolete.emit(result);
    }
    fr.readAsText(file);
  }

}
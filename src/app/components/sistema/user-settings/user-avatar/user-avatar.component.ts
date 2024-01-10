import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { toBase64 } from 'src/app/utils/utils';

@Component({
  selector: 'senap-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css']
})
export class UserAvatarComponent implements OnInit {

  constructor() { }

  imageBase64: string = "";

  @Input()
  urlCurrentImage: string = "";

  @Output()
  onImageSelected = new EventEmitter<File>();

  ngOnInit(): void {
  }

  change(event: any) {
    if (event.target.files.length > 0){
      const file: File = event.target.files[0];
      toBase64(file).then((value: string) => this.imageBase64 = value);
      this.onImageSelected.emit(file);
      this.urlCurrentImage = "";
    }
  }

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'fury-toolbar-search',
  templateUrl: './toolbar-search.component.html',
  styleUrls: ['./toolbar-search.component.scss']
})
export class ToolbarSearchComponent implements OnInit {

  isOpen: boolean = false;

  @ViewChild('input', { read: ElementRef, static: true }) input: ElementRef | any;

  constructor() {
  }

  ngOnInit() {
  }

  open() {
    this.isOpen = true;

    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 100);

  }

  close() {
    this.isOpen = false;
  }

}

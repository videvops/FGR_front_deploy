import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ListColumn } from './list-column.model';

@Component({
  selector: 'fury-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements AfterViewInit {

  @Input() name: string = "";
  @Input() columns: ListColumn[] = [];
  @Input() titleBuscar: string = "Buscar";

  @ViewChild('filter') filter: ElementRef | any;
  @Output() filterChange = new EventEmitter<string>();

  @Input() hideHeader: boolean = false;

  constructor() {
  }

  ngAfterViewInit() {
    if (!this.hideHeader) {
      fromEvent(this.filter.nativeElement, 'keyup').pipe(
        distinctUntilChanged(),
        debounceTime(150)
      ).subscribe(() => {
        this.filterChange.emit(this.filter.nativeElement.value);
      });
    }
  }

  toggleColumnVisibility(column: any, event: any) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
}

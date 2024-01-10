import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDetenidosComponent } from './tabla-detenidos.component';

describe('TablaDetenidosComponent', () => {
  let component: TablaDetenidosComponent;
  let fixture: ComponentFixture<TablaDetenidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaDetenidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDetenidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

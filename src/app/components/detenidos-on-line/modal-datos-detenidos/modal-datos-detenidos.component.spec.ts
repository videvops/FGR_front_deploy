import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDatosDetenidosComponent } from './modal-datos-detenidos.component';

describe('ModalDatosDetenidosComponent', () => {
  let component: ModalDatosDetenidosComponent;
  let fixture: ComponentFixture<ModalDatosDetenidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDatosDetenidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDatosDetenidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

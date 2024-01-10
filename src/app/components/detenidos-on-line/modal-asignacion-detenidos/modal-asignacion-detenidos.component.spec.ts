import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignacionDetenidosComponent } from './modal-asignacion-detenidos.component';

describe('ModalAsignacionDetenidosComponent', () => {
  let component: ModalAsignacionDetenidosComponent;
  let fixture: ComponentFixture<ModalAsignacionDetenidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAsignacionDetenidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsignacionDetenidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

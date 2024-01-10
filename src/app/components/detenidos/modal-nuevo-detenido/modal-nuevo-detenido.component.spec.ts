import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevoDetenidoComponent } from './modal-nuevo-detenido.component';

describe('ModalNuevoDetenidoComponent', () => {
  let component: ModalNuevoDetenidoComponent;
  let fixture: ComponentFixture<ModalNuevoDetenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNuevoDetenidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNuevoDetenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

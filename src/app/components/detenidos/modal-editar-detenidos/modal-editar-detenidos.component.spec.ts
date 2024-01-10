import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarDetenidosComponent } from './modal-editar-detenidos.component';

describe('ModalEditarDetenidosComponent', () => {
  let component: ModalEditarDetenidosComponent;
  let fixture: ComponentFixture<ModalEditarDetenidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditarDetenidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarDetenidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFichasComponent } from './modal-fichas.component';

describe('ModalFichasComponent', () => {
  let component: ModalFichasComponent;
  let fixture: ComponentFixture<ModalFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFichasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

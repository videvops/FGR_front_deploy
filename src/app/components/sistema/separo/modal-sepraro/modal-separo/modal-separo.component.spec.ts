import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeparoComponent } from './modal-separo.component';

describe('ModalSeparoComponent', () => {
  let component: ModalSeparoComponent;
  let fixture: ComponentFixture<ModalSeparoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSeparoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSeparoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetenidosComponent } from './detenidos.component';

describe('DetenidosComponent', () => {
  let component: DetenidosComponent;
  let fixture: ComponentFixture<DetenidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetenidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetenidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

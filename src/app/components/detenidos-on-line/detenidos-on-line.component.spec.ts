import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetenidosOnLineComponent } from './detenidos-on-line.component';

describe('DetenidosOnLineComponent', () => {
  let component: DetenidosOnLineComponent;
  let fixture: ComponentFixture<DetenidosOnLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetenidosOnLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetenidosOnLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

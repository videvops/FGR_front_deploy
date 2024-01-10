import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoDetenidoCenapiComponent } from './archivo-detenido-cenapi.component';

describe('ArchivoDetenidoCenapiComponent', () => {
  let component: ArchivoDetenidoCenapiComponent;
  let fixture: ComponentFixture<ArchivoDetenidoCenapiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivoDetenidoCenapiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoDetenidoCenapiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

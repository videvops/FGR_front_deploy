import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDetenidosOnlineComponent } from './tabla-detenidos-online.component';

describe('TablaDetenidosOnlineComponent', () => {
  let component: TablaDetenidosOnlineComponent;
  let fixture: ComponentFixture<TablaDetenidosOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaDetenidosOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDetenidosOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

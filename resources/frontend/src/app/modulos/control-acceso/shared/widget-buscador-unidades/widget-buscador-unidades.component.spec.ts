import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBuscadorUnidadesComponent } from './widget-buscador-unidades.component';

describe('WidgetBuscadorUnidadesComponent', () => {
  let component: WidgetBuscadorUnidadesComponent;
  let fixture: ComponentFixture<WidgetBuscadorUnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetBuscadorUnidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetBuscadorUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

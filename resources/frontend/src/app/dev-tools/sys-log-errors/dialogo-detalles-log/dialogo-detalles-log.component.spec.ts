import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoDetallesLogComponent } from './dialogo-detalles-log.component';

describe('DialogoDetallesLogComponent', () => {
  let component: DialogoDetallesLogComponent;
  let fixture: ComponentFixture<DialogoDetallesLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoDetallesLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoDetallesLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

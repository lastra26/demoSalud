import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoUsuarioComponent } from './dialogo-usuario.component';

describe('DialogoUsuarioComponent', () => {
  let component: DialogoUsuarioComponent;
  let fixture: ComponentFixture<DialogoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

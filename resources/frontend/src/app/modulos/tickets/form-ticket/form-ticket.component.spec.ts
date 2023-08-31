import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTicketsComponent } from './form-ticket.component';

describe('DialogoUsuarioComponent', () => {
  let component: FormTicketsComponent;
  let fixture: ComponentFixture<FormTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

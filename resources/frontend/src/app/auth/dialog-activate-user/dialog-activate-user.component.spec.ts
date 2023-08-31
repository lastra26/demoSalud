import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogActivateUserComponent } from './dialog-activate-user.component';

describe('DialogActivateUserComponent', () => {
  let component: DialogActivateUserComponent;
  let fixture: ComponentFixture<DialogActivateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogActivateUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogActivateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

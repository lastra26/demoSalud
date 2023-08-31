import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionUserMenuComponent } from './session-user-menu.component';

describe('SessionUserMenuComponent', () => {
  let component: SessionUserMenuComponent;
  let fixture: ComponentFixture<SessionUserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionUserMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionUserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DrawerListComponent } from './drawer-list.component';

describe('DrawerListComponent', () => {
  let component: DrawerListComponent;
  let fixture: ComponentFixture<DrawerListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

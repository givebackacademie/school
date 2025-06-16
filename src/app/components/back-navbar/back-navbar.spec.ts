import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackNavbar } from './back-navbar';

describe('BackNavbar', () => {
  let component: BackNavbar;
  let fixture: ComponentFixture<BackNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

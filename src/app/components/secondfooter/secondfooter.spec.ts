import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secondfooter } from './secondfooter';

describe('Secondfooter', () => {
  let component: Secondfooter;
  let fixture: ComponentFixture<Secondfooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Secondfooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Secondfooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

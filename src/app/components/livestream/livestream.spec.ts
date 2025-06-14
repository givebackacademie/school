import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Livestream } from './livestream';

describe('Livestream', () => {
  let component: Livestream;
  let fixture: ComponentFixture<Livestream>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livestream]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Livestream);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

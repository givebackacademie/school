import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Getstream } from './getstream';

describe('Getstream', () => {
  let component: Getstream;
  let fixture: ComponentFixture<Getstream>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Getstream]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Getstream);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Corkboard } from './corkboard';

describe('Corkboard', () => {
  let component: Corkboard;
  let fixture: ComponentFixture<Corkboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Corkboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Corkboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

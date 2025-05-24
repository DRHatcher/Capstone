import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedTimesComponent } from './reserved-times.component';

describe('ReservedTimesComponent', () => {
  let component: ReservedTimesComponent;
  let fixture: ComponentFixture<ReservedTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservedTimesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservedTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

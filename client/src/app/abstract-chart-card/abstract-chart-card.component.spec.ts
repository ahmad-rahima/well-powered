import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractChartCardComponent } from './abstract-chart-card.component';

describe('AbstractChartCardComponent', () => {
  let component: AbstractChartCardComponent;
  let fixture: ComponentFixture<AbstractChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractChartCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

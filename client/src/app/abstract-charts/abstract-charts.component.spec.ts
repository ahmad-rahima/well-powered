import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractChartsComponent } from './abstract-charts.component';

describe('AbstractChartsComponent', () => {
  let component: AbstractChartsComponent;
  let fixture: ComponentFixture<AbstractChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSubmitterComponent } from './item-submitter.component';

describe('ItemSubmitterComponent', () => {
  let component: ItemSubmitterComponent;
  let fixture: ComponentFixture<ItemSubmitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSubmitterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSubmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

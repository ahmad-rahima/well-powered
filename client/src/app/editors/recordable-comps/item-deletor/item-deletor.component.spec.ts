import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDeletorComponent } from './item-deletor.component';

describe('ItemDeletorComponent', () => {
  let component: ItemDeletorComponent;
  let fixture: ComponentFixture<ItemDeletorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDeletorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDeletorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

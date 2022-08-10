import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavRecordsAdBannerComponent } from './nav-records-ad-banner.component';

describe('NavRecordsAdBannerComponent', () => {
  let component: NavRecordsAdBannerComponent;
  let fixture: ComponentFixture<NavRecordsAdBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavRecordsAdBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavRecordsAdBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

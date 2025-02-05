import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PubAdminComponent } from './pub-admin.component';

describe('PubAdminComponent', () => {
  let component: PubAdminComponent;
  let fixture: ComponentFixture<PubAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PubAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

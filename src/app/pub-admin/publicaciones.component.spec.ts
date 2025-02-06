import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PubAdmin } from './publicaciones.component';

describe('PubAdmin', () => {
  let component: PubAdmin;
  let fixture: ComponentFixture<PubAdmin>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PubAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(PubAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

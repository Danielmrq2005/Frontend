import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatsgrupalesComponent } from './chatsgrupales.component';

describe('ChatsgrupalesComponent', () => {
  let component: ChatsgrupalesComponent;
  let fixture: ComponentFixture<ChatsgrupalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ChatsgrupalesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsgrupalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HasSidoBaneadoComponent } from './has-sido-baneado.component';

describe('HasSidoBaneadoComponent', () => {
  let component: HasSidoBaneadoComponent;
  let fixture: ComponentFixture<HasSidoBaneadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HasSidoBaneadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HasSidoBaneadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

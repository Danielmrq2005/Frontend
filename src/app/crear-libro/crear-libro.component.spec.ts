import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearLibroComponent } from './crear-libro.component';

describe('CrearLibroComponent', () => {
  let component: CrearLibroComponent;
  let fixture: ComponentFixture<CrearLibroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearLibroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosAprendizajeComponent } from './videos-aprendizaje.component';

describe('VideosAprendizajeComponent', () => {
  let component: VideosAprendizajeComponent;
  let fixture: ComponentFixture<VideosAprendizajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideosAprendizajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideosAprendizajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

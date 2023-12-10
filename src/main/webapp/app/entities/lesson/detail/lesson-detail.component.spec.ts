import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LessonDetailComponent } from './lesson-detail.component';

describe('Lesson Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: LessonDetailComponent,
              resolve: { lesson: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(LessonDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load lesson on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LessonDetailComponent);

      // THEN
      expect(instance.lesson).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

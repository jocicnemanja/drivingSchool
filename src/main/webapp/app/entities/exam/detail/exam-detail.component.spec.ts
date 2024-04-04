import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExamDetailComponent } from './exam-detail.component';

describe('Exam Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExamDetailComponent,
              resolve: { exam: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExamDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load exam on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExamDetailComponent);

      // THEN
      expect(instance.exam).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

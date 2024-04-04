import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AssuranceDetailComponent } from './assurance-detail.component';

describe('Assurance Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssuranceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AssuranceDetailComponent,
              resolve: { assurance: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AssuranceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load assurance on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AssuranceDetailComponent);

      // THEN
      expect(instance.assurance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

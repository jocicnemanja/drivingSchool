import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReportsDetailComponent } from './reports-detail.component';

describe('Reports Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ReportsDetailComponent,
              resolve: { reports: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ReportsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load reports on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ReportsDetailComponent);

      // THEN
      expect(instance.reports).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

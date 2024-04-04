import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DocumentsDetailComponent } from './documents-detail.component';

describe('Documents Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: DocumentsDetailComponent,
              resolve: { documents: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(DocumentsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load documents on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', DocumentsDetailComponent);

      // THEN
      expect(instance.documents).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

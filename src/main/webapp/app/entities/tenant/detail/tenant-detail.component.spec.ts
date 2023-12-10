import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TenantDetailComponent } from './tenant-detail.component';

describe('Tenant Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TenantDetailComponent,
              resolve: { tenant: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TenantDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load tenant on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TenantDetailComponent);

      // THEN
      expect(instance.tenant).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

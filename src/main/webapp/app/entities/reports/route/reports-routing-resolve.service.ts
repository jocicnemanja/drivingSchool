import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReports } from '../reports.model';
import { ReportsService } from '../service/reports.service';

export const reportsResolve = (route: ActivatedRouteSnapshot): Observable<null | IReports> => {
  const id = route.params['id'];
  if (id) {
    return inject(ReportsService)
      .find(id)
      .pipe(
        mergeMap((reports: HttpResponse<IReports>) => {
          if (reports.body) {
            return of(reports.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default reportsResolve;

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReports, NewReports } from '../reports.model';

export type PartialUpdateReports = Partial<IReports> & Pick<IReports, 'id'>;

export type EntityResponseType = HttpResponse<IReports>;
export type EntityArrayResponseType = HttpResponse<IReports[]>;

@Injectable({ providedIn: 'root' })
export class ReportsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reports');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(reports: NewReports): Observable<EntityResponseType> {
    return this.http.post<IReports>(this.resourceUrl, reports, { observe: 'response' });
  }

  update(reports: IReports): Observable<EntityResponseType> {
    return this.http.put<IReports>(`${this.resourceUrl}/${this.getReportsIdentifier(reports)}`, reports, { observe: 'response' });
  }

  partialUpdate(reports: PartialUpdateReports): Observable<EntityResponseType> {
    return this.http.patch<IReports>(`${this.resourceUrl}/${this.getReportsIdentifier(reports)}`, reports, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReports>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReports[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReportsIdentifier(reports: Pick<IReports, 'id'>): number {
    return reports.id;
  }

  compareReports(o1: Pick<IReports, 'id'> | null, o2: Pick<IReports, 'id'> | null): boolean {
    return o1 && o2 ? this.getReportsIdentifier(o1) === this.getReportsIdentifier(o2) : o1 === o2;
  }

  addReportsToCollectionIfMissing<Type extends Pick<IReports, 'id'>>(
    reportsCollection: Type[],
    ...reportsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reports: Type[] = reportsToCheck.filter(isPresent);
    if (reports.length > 0) {
      const reportsCollectionIdentifiers = reportsCollection.map(reportsItem => this.getReportsIdentifier(reportsItem)!);
      const reportsToAdd = reports.filter(reportsItem => {
        const reportsIdentifier = this.getReportsIdentifier(reportsItem);
        if (reportsCollectionIdentifiers.includes(reportsIdentifier)) {
          return false;
        }
        reportsCollectionIdentifiers.push(reportsIdentifier);
        return true;
      });
      return [...reportsToAdd, ...reportsCollection];
    }
    return reportsCollection;
  }
}

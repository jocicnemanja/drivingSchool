import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAssurance, NewAssurance } from '../assurance.model';

export type PartialUpdateAssurance = Partial<IAssurance> & Pick<IAssurance, 'id'>;

type RestOf<T extends IAssurance | NewAssurance> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestAssurance = RestOf<IAssurance>;

export type NewRestAssurance = RestOf<NewAssurance>;

export type PartialUpdateRestAssurance = RestOf<PartialUpdateAssurance>;

export type EntityResponseType = HttpResponse<IAssurance>;
export type EntityArrayResponseType = HttpResponse<IAssurance[]>;

@Injectable({ providedIn: 'root' })
export class AssuranceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/assurances');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(assurance: NewAssurance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assurance);
    return this.http
      .post<RestAssurance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(assurance: IAssurance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assurance);
    return this.http
      .put<RestAssurance>(`${this.resourceUrl}/${this.getAssuranceIdentifier(assurance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(assurance: PartialUpdateAssurance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assurance);
    return this.http
      .patch<RestAssurance>(`${this.resourceUrl}/${this.getAssuranceIdentifier(assurance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAssurance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAssurance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAssuranceIdentifier(assurance: Pick<IAssurance, 'id'>): number {
    return assurance.id;
  }

  compareAssurance(o1: Pick<IAssurance, 'id'> | null, o2: Pick<IAssurance, 'id'> | null): boolean {
    return o1 && o2 ? this.getAssuranceIdentifier(o1) === this.getAssuranceIdentifier(o2) : o1 === o2;
  }

  addAssuranceToCollectionIfMissing<Type extends Pick<IAssurance, 'id'>>(
    assuranceCollection: Type[],
    ...assurancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const assurances: Type[] = assurancesToCheck.filter(isPresent);
    if (assurances.length > 0) {
      const assuranceCollectionIdentifiers = assuranceCollection.map(assuranceItem => this.getAssuranceIdentifier(assuranceItem)!);
      const assurancesToAdd = assurances.filter(assuranceItem => {
        const assuranceIdentifier = this.getAssuranceIdentifier(assuranceItem);
        if (assuranceCollectionIdentifiers.includes(assuranceIdentifier)) {
          return false;
        }
        assuranceCollectionIdentifiers.push(assuranceIdentifier);
        return true;
      });
      return [...assurancesToAdd, ...assuranceCollection];
    }
    return assuranceCollection;
  }

  protected convertDateFromClient<T extends IAssurance | NewAssurance | PartialUpdateAssurance>(assurance: T): RestOf<T> {
    return {
      ...assurance,
      date: assurance.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAssurance: RestAssurance): IAssurance {
    return {
      ...restAssurance,
      date: restAssurance.date ? dayjs(restAssurance.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAssurance>): HttpResponse<IAssurance> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAssurance[]>): HttpResponse<IAssurance[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}

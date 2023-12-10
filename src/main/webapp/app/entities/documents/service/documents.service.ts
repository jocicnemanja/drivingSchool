import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocuments, NewDocuments } from '../documents.model';

export type PartialUpdateDocuments = Partial<IDocuments> & Pick<IDocuments, 'id'>;

export type EntityResponseType = HttpResponse<IDocuments>;
export type EntityArrayResponseType = HttpResponse<IDocuments[]>;

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/documents');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(documents: NewDocuments): Observable<EntityResponseType> {
    return this.http.post<IDocuments>(this.resourceUrl, documents, { observe: 'response' });
  }

  update(documents: IDocuments): Observable<EntityResponseType> {
    return this.http.put<IDocuments>(`${this.resourceUrl}/${this.getDocumentsIdentifier(documents)}`, documents, { observe: 'response' });
  }

  partialUpdate(documents: PartialUpdateDocuments): Observable<EntityResponseType> {
    return this.http.patch<IDocuments>(`${this.resourceUrl}/${this.getDocumentsIdentifier(documents)}`, documents, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDocuments>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocuments[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDocumentsIdentifier(documents: Pick<IDocuments, 'id'>): number {
    return documents.id;
  }

  compareDocuments(o1: Pick<IDocuments, 'id'> | null, o2: Pick<IDocuments, 'id'> | null): boolean {
    return o1 && o2 ? this.getDocumentsIdentifier(o1) === this.getDocumentsIdentifier(o2) : o1 === o2;
  }

  addDocumentsToCollectionIfMissing<Type extends Pick<IDocuments, 'id'>>(
    documentsCollection: Type[],
    ...documentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const documents: Type[] = documentsToCheck.filter(isPresent);
    if (documents.length > 0) {
      const documentsCollectionIdentifiers = documentsCollection.map(documentsItem => this.getDocumentsIdentifier(documentsItem)!);
      const documentsToAdd = documents.filter(documentsItem => {
        const documentsIdentifier = this.getDocumentsIdentifier(documentsItem);
        if (documentsCollectionIdentifiers.includes(documentsIdentifier)) {
          return false;
        }
        documentsCollectionIdentifiers.push(documentsIdentifier);
        return true;
      });
      return [...documentsToAdd, ...documentsCollection];
    }
    return documentsCollection;
  }
}

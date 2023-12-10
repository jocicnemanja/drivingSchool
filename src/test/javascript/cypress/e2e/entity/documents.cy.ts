import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Documents e2e test', () => {
  const documentsPageUrl = '/documents';
  const documentsPageUrlPattern = new RegExp('/documents(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const documentsSample = {};

  let documents;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/documents+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/documents').as('postEntityRequest');
    cy.intercept('DELETE', '/api/documents/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (documents) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/documents/${documents.id}`,
      }).then(() => {
        documents = undefined;
      });
    }
  });

  it('Documents menu should load Documents page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('documents');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Documents').should('exist');
    cy.url().should('match', documentsPageUrlPattern);
  });

  describe('Documents page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(documentsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Documents page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/documents/new$'));
        cy.getEntityCreateUpdateHeading('Documents');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', documentsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/documents',
          body: documentsSample,
        }).then(({ body }) => {
          documents = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/documents+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/documents?page=0&size=20>; rel="last",<http://localhost/api/documents?page=0&size=20>; rel="first"',
              },
              body: [documents],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(documentsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Documents page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('documents');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', documentsPageUrlPattern);
      });

      it('edit button click should load edit Documents page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Documents');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', documentsPageUrlPattern);
      });

      it('edit button click should load edit Documents page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Documents');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', documentsPageUrlPattern);
      });

      it('last delete button click should delete instance of Documents', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('documents').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', documentsPageUrlPattern);

        documents = undefined;
      });
    });
  });

  describe('new Documents page', () => {
    beforeEach(() => {
      cy.visit(`${documentsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Documents');
    });

    it('should create an instance of Documents', () => {
      cy.get(`[data-cy="name"]`).type('once abound');
      cy.get(`[data-cy="name"]`).should('have.value', 'once abound');

      cy.get(`[data-cy="type"]`).type('diligent');
      cy.get(`[data-cy="type"]`).should('have.value', 'diligent');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        documents = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', documentsPageUrlPattern);
    });
  });
});

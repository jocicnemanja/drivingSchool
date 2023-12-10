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

describe('Reports e2e test', () => {
  const reportsPageUrl = '/reports';
  const reportsPageUrlPattern = new RegExp('/reports(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const reportsSample = {};

  let reports;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/reports+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/reports').as('postEntityRequest');
    cy.intercept('DELETE', '/api/reports/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (reports) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/reports/${reports.id}`,
      }).then(() => {
        reports = undefined;
      });
    }
  });

  it('Reports menu should load Reports page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('reports');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Reports').should('exist');
    cy.url().should('match', reportsPageUrlPattern);
  });

  describe('Reports page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(reportsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Reports page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/reports/new$'));
        cy.getEntityCreateUpdateHeading('Reports');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/reports',
          body: reportsSample,
        }).then(({ body }) => {
          reports = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/reports+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/reports?page=0&size=20>; rel="last",<http://localhost/api/reports?page=0&size=20>; rel="first"',
              },
              body: [reports],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(reportsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Reports page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('reports');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportsPageUrlPattern);
      });

      it('edit button click should load edit Reports page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Reports');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportsPageUrlPattern);
      });

      it('edit button click should load edit Reports page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Reports');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportsPageUrlPattern);
      });

      it('last delete button click should delete instance of Reports', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('reports').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportsPageUrlPattern);

        reports = undefined;
      });
    });
  });

  describe('new Reports page', () => {
    beforeEach(() => {
      cy.visit(`${reportsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Reports');
    });

    it('should create an instance of Reports', () => {
      cy.get(`[data-cy="name"]`).type('delightful');
      cy.get(`[data-cy="name"]`).should('have.value', 'delightful');

      cy.get(`[data-cy="type"]`).type('whoa false beyond');
      cy.get(`[data-cy="type"]`).should('have.value', 'whoa false beyond');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        reports = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', reportsPageUrlPattern);
    });
  });
});

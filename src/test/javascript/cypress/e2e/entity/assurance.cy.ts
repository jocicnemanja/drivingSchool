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

describe('Assurance e2e test', () => {
  const assurancePageUrl = '/assurance';
  const assurancePageUrlPattern = new RegExp('/assurance(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const assuranceSample = {};

  let assurance;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/assurances+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/assurances').as('postEntityRequest');
    cy.intercept('DELETE', '/api/assurances/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (assurance) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/assurances/${assurance.id}`,
      }).then(() => {
        assurance = undefined;
      });
    }
  });

  it('Assurances menu should load Assurances page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('assurance');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Assurance').should('exist');
    cy.url().should('match', assurancePageUrlPattern);
  });

  describe('Assurance page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(assurancePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Assurance page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/assurance/new$'));
        cy.getEntityCreateUpdateHeading('Assurance');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', assurancePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/assurances',
          body: assuranceSample,
        }).then(({ body }) => {
          assurance = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/assurances+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/assurances?page=0&size=20>; rel="last",<http://localhost/api/assurances?page=0&size=20>; rel="first"',
              },
              body: [assurance],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(assurancePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Assurance page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('assurance');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', assurancePageUrlPattern);
      });

      it('edit button click should load edit Assurance page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Assurance');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', assurancePageUrlPattern);
      });

      it('edit button click should load edit Assurance page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Assurance');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', assurancePageUrlPattern);
      });

      it('last delete button click should delete instance of Assurance', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('assurance').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', assurancePageUrlPattern);

        assurance = undefined;
      });
    });
  });

  describe('new Assurance page', () => {
    beforeEach(() => {
      cy.visit(`${assurancePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Assurance');
    });

    it('should create an instance of Assurance', () => {
      cy.get(`[data-cy="date"]`).type('2023-12-09T23:47');
      cy.get(`[data-cy="date"]`).blur();
      cy.get(`[data-cy="date"]`).should('have.value', '2023-12-09T23:47');

      cy.get(`[data-cy="type"]`).type('treasured longingly until');
      cy.get(`[data-cy="type"]`).should('have.value', 'treasured longingly until');

      cy.get(`[data-cy="constAmount"]`).type('17326');
      cy.get(`[data-cy="constAmount"]`).should('have.value', '17326');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        assurance = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', assurancePageUrlPattern);
    });
  });
});

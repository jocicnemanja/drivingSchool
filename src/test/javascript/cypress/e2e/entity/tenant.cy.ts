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

describe('Tenant e2e test', () => {
  const tenantPageUrl = '/tenant';
  const tenantPageUrlPattern = new RegExp('/tenant(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const tenantSample = {};

  let tenant;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/tenants+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/tenants').as('postEntityRequest');
    cy.intercept('DELETE', '/api/tenants/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (tenant) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/tenants/${tenant.id}`,
      }).then(() => {
        tenant = undefined;
      });
    }
  });

  it('Tenants menu should load Tenants page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('tenant');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Tenant').should('exist');
    cy.url().should('match', tenantPageUrlPattern);
  });

  describe('Tenant page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(tenantPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Tenant page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/tenant/new$'));
        cy.getEntityCreateUpdateHeading('Tenant');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tenantPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/tenants',
          body: tenantSample,
        }).then(({ body }) => {
          tenant = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/tenants+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [tenant],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(tenantPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Tenant page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('tenant');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tenantPageUrlPattern);
      });

      it('edit button click should load edit Tenant page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Tenant');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tenantPageUrlPattern);
      });

      it('edit button click should load edit Tenant page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Tenant');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tenantPageUrlPattern);
      });

      it('last delete button click should delete instance of Tenant', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('tenant').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tenantPageUrlPattern);

        tenant = undefined;
      });
    });
  });

  describe('new Tenant page', () => {
    beforeEach(() => {
      cy.visit(`${tenantPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Tenant');
    });

    it('should create an instance of Tenant', () => {
      cy.get(`[data-cy="name"]`).type('crossly');
      cy.get(`[data-cy="name"]`).should('have.value', 'crossly');

      cy.get(`[data-cy="phoneNumber"]`).type('off eyeliner');
      cy.get(`[data-cy="phoneNumber"]`).should('have.value', 'off eyeliner');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        tenant = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', tenantPageUrlPattern);
    });
  });
});

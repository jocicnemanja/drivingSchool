package com.drivingschool.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.drivingschool.IntegrationTest;
import com.drivingschool.domain.Documents;
import com.drivingschool.repository.DocumentsRepository;
import com.drivingschool.service.dto.DocumentsDTO;
import com.drivingschool.service.mapper.DocumentsMapper;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DocumentsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DocumentsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/documents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DocumentsRepository documentsRepository;

    @Autowired
    private DocumentsMapper documentsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDocumentsMockMvc;

    private Documents documents;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Documents createEntity(EntityManager em) {
        Documents documents = new Documents().name(DEFAULT_NAME).type(DEFAULT_TYPE);
        return documents;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Documents createUpdatedEntity(EntityManager em) {
        Documents documents = new Documents().name(UPDATED_NAME).type(UPDATED_TYPE);
        return documents;
    }

    @BeforeEach
    public void initTest() {
        documents = createEntity(em);
    }

    @Test
    @Transactional
    void createDocuments() throws Exception {
        int databaseSizeBeforeCreate = documentsRepository.findAll().size();
        // Create the Documents
        DocumentsDTO documentsDTO = documentsMapper.toDto(documents);
        restDocumentsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(documentsDTO)))
            .andExpect(status().isCreated());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeCreate + 1);
        Documents testDocuments = documentsList.get(documentsList.size() - 1);
        assertThat(testDocuments.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDocuments.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createDocumentsWithExistingId() throws Exception {
        // Create the Documents with an existing ID
        documents.setId(1L);
        DocumentsDTO documentsDTO = documentsMapper.toDto(documents);

        int databaseSizeBeforeCreate = documentsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(documentsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDocuments() throws Exception {
        // Initialize the database
        documentsRepository.saveAndFlush(documents);

        // Get all the documentsList
        restDocumentsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documents.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)));
    }

    @Test
    @Transactional
    void getDocuments() throws Exception {
        // Initialize the database
        documentsRepository.saveAndFlush(documents);

        // Get the documents
        restDocumentsMockMvc
            .perform(get(ENTITY_API_URL_ID, documents.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(documents.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingDocuments() throws Exception {
        // Get the documents
        restDocumentsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDocuments() throws Exception {
        // Initialize the database
        documentsRepository.saveAndFlush(documents);

        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();

        // Update the documents
        Documents updatedDocuments = documentsRepository.findById(documents.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDocuments are not directly saved in db
        em.detach(updatedDocuments);
        updatedDocuments.name(UPDATED_NAME).type(UPDATED_TYPE);
        DocumentsDTO documentsDTO = documentsMapper.toDto(updatedDocuments);

        restDocumentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documentsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentsDTO))
            )
            .andExpect(status().isOk());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
        Documents testDocuments = documentsList.get(documentsList.size() - 1);
        assertThat(testDocuments.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDocuments.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingDocuments() throws Exception {
        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();
        documents.setId(longCount.incrementAndGet());

        // Create the Documents
        DocumentsDTO documentsDTO = documentsMapper.toDto(documents);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, documentsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDocuments() throws Exception {
        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();
        documents.setId(longCount.incrementAndGet());

        // Create the Documents
        DocumentsDTO documentsDTO = documentsMapper.toDto(documents);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(documentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDocuments() throws Exception {
        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();
        documents.setId(longCount.incrementAndGet());

        // Create the Documents
        DocumentsDTO documentsDTO = documentsMapper.toDto(documents);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(documentsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDocumentsWithPatch() throws Exception {
        // Initialize the database
        documentsRepository.saveAndFlush(documents);

        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();

        // Update the documents using partial update
        Documents partialUpdatedDocuments = new Documents();
        partialUpdatedDocuments.setId(documents.getId());

        partialUpdatedDocuments.name(UPDATED_NAME).type(UPDATED_TYPE);

        restDocumentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocuments.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocuments))
            )
            .andExpect(status().isOk());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
        Documents testDocuments = documentsList.get(documentsList.size() - 1);
        assertThat(testDocuments.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDocuments.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateDocumentsWithPatch() throws Exception {
        // Initialize the database
        documentsRepository.saveAndFlush(documents);

        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();

        // Update the documents using partial update
        Documents partialUpdatedDocuments = new Documents();
        partialUpdatedDocuments.setId(documents.getId());

        partialUpdatedDocuments.name(UPDATED_NAME).type(UPDATED_TYPE);

        restDocumentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocuments.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocuments))
            )
            .andExpect(status().isOk());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
        Documents testDocuments = documentsList.get(documentsList.size() - 1);
        assertThat(testDocuments.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDocuments.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingDocuments() throws Exception {
        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();
        documents.setId(longCount.incrementAndGet());

        // Create the Documents
        DocumentsDTO documentsDTO = documentsMapper.toDto(documents);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, documentsDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(documentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDocuments() throws Exception {
        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();
        documents.setId(longCount.incrementAndGet());

        // Create the Documents
        DocumentsDTO documentsDTO = documentsMapper.toDto(documents);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(documentsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDocuments() throws Exception {
        int databaseSizeBeforeUpdate = documentsRepository.findAll().size();
        documents.setId(longCount.incrementAndGet());

        // Create the Documents
        DocumentsDTO documentsDTO = documentsMapper.toDto(documents);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocumentsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(documentsDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Documents in the database
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDocuments() throws Exception {
        // Initialize the database
        documentsRepository.saveAndFlush(documents);

        int databaseSizeBeforeDelete = documentsRepository.findAll().size();

        // Delete the documents
        restDocumentsMockMvc
            .perform(delete(ENTITY_API_URL_ID, documents.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Documents> documentsList = documentsRepository.findAll();
        assertThat(documentsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

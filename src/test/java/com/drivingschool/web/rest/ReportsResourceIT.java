package com.drivingschool.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.drivingschool.IntegrationTest;
import com.drivingschool.domain.Reports;
import com.drivingschool.repository.ReportsRepository;
import com.drivingschool.service.dto.ReportsDTO;
import com.drivingschool.service.mapper.ReportsMapper;
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
 * Integration tests for the {@link ReportsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReportsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/reports";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReportsRepository reportsRepository;

    @Autowired
    private ReportsMapper reportsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReportsMockMvc;

    private Reports reports;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reports createEntity(EntityManager em) {
        Reports reports = new Reports().name(DEFAULT_NAME).type(DEFAULT_TYPE);
        return reports;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reports createUpdatedEntity(EntityManager em) {
        Reports reports = new Reports().name(UPDATED_NAME).type(UPDATED_TYPE);
        return reports;
    }

    @BeforeEach
    public void initTest() {
        reports = createEntity(em);
    }

    @Test
    @Transactional
    void createReports() throws Exception {
        int databaseSizeBeforeCreate = reportsRepository.findAll().size();
        // Create the Reports
        ReportsDTO reportsDTO = reportsMapper.toDto(reports);
        restReportsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reportsDTO)))
            .andExpect(status().isCreated());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeCreate + 1);
        Reports testReports = reportsList.get(reportsList.size() - 1);
        assertThat(testReports.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testReports.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createReportsWithExistingId() throws Exception {
        // Create the Reports with an existing ID
        reports.setId(1L);
        ReportsDTO reportsDTO = reportsMapper.toDto(reports);

        int databaseSizeBeforeCreate = reportsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReportsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reportsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReports() throws Exception {
        // Initialize the database
        reportsRepository.saveAndFlush(reports);

        // Get all the reportsList
        restReportsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reports.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)));
    }

    @Test
    @Transactional
    void getReports() throws Exception {
        // Initialize the database
        reportsRepository.saveAndFlush(reports);

        // Get the reports
        restReportsMockMvc
            .perform(get(ENTITY_API_URL_ID, reports.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reports.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingReports() throws Exception {
        // Get the reports
        restReportsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReports() throws Exception {
        // Initialize the database
        reportsRepository.saveAndFlush(reports);

        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();

        // Update the reports
        Reports updatedReports = reportsRepository.findById(reports.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReports are not directly saved in db
        em.detach(updatedReports);
        updatedReports.name(UPDATED_NAME).type(UPDATED_TYPE);
        ReportsDTO reportsDTO = reportsMapper.toDto(updatedReports);

        restReportsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reportsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reportsDTO))
            )
            .andExpect(status().isOk());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
        Reports testReports = reportsList.get(reportsList.size() - 1);
        assertThat(testReports.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testReports.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingReports() throws Exception {
        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();
        reports.setId(longCount.incrementAndGet());

        // Create the Reports
        ReportsDTO reportsDTO = reportsMapper.toDto(reports);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reportsDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reportsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReports() throws Exception {
        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();
        reports.setId(longCount.incrementAndGet());

        // Create the Reports
        ReportsDTO reportsDTO = reportsMapper.toDto(reports);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reportsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReports() throws Exception {
        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();
        reports.setId(longCount.incrementAndGet());

        // Create the Reports
        ReportsDTO reportsDTO = reportsMapper.toDto(reports);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reportsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReportsWithPatch() throws Exception {
        // Initialize the database
        reportsRepository.saveAndFlush(reports);

        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();

        // Update the reports using partial update
        Reports partialUpdatedReports = new Reports();
        partialUpdatedReports.setId(reports.getId());

        partialUpdatedReports.name(UPDATED_NAME);

        restReportsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReports.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReports))
            )
            .andExpect(status().isOk());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
        Reports testReports = reportsList.get(reportsList.size() - 1);
        assertThat(testReports.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testReports.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateReportsWithPatch() throws Exception {
        // Initialize the database
        reportsRepository.saveAndFlush(reports);

        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();

        // Update the reports using partial update
        Reports partialUpdatedReports = new Reports();
        partialUpdatedReports.setId(reports.getId());

        partialUpdatedReports.name(UPDATED_NAME).type(UPDATED_TYPE);

        restReportsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReports.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReports))
            )
            .andExpect(status().isOk());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
        Reports testReports = reportsList.get(reportsList.size() - 1);
        assertThat(testReports.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testReports.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingReports() throws Exception {
        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();
        reports.setId(longCount.incrementAndGet());

        // Create the Reports
        ReportsDTO reportsDTO = reportsMapper.toDto(reports);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reportsDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reportsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReports() throws Exception {
        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();
        reports.setId(longCount.incrementAndGet());

        // Create the Reports
        ReportsDTO reportsDTO = reportsMapper.toDto(reports);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reportsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReports() throws Exception {
        int databaseSizeBeforeUpdate = reportsRepository.findAll().size();
        reports.setId(longCount.incrementAndGet());

        // Create the Reports
        ReportsDTO reportsDTO = reportsMapper.toDto(reports);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(reportsDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reports in the database
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReports() throws Exception {
        // Initialize the database
        reportsRepository.saveAndFlush(reports);

        int databaseSizeBeforeDelete = reportsRepository.findAll().size();

        // Delete the reports
        restReportsMockMvc
            .perform(delete(ENTITY_API_URL_ID, reports.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Reports> reportsList = reportsRepository.findAll();
        assertThat(reportsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

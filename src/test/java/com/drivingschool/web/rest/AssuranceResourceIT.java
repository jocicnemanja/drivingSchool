package com.drivingschool.web.rest;

import static com.drivingschool.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.drivingschool.IntegrationTest;
import com.drivingschool.domain.Assurance;
import com.drivingschool.repository.AssuranceRepository;
import com.drivingschool.service.dto.AssuranceDTO;
import com.drivingschool.service.mapper.AssuranceMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link AssuranceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AssuranceResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final Integer DEFAULT_CONST_AMOUNT = 1;
    private static final Integer UPDATED_CONST_AMOUNT = 2;

    private static final String ENTITY_API_URL = "/api/assurances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AssuranceRepository assuranceRepository;

    @Autowired
    private AssuranceMapper assuranceMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAssuranceMockMvc;

    private Assurance assurance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Assurance createEntity(EntityManager em) {
        Assurance assurance = new Assurance().date(DEFAULT_DATE).type(DEFAULT_TYPE).constAmount(DEFAULT_CONST_AMOUNT);
        return assurance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Assurance createUpdatedEntity(EntityManager em) {
        Assurance assurance = new Assurance().date(UPDATED_DATE).type(UPDATED_TYPE).constAmount(UPDATED_CONST_AMOUNT);
        return assurance;
    }

    @BeforeEach
    public void initTest() {
        assurance = createEntity(em);
    }

    @Test
    @Transactional
    void createAssurance() throws Exception {
        int databaseSizeBeforeCreate = assuranceRepository.findAll().size();
        // Create the Assurance
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(assurance);
        restAssuranceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assuranceDTO)))
            .andExpect(status().isCreated());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeCreate + 1);
        Assurance testAssurance = assuranceList.get(assuranceList.size() - 1);
        assertThat(testAssurance.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testAssurance.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAssurance.getConstAmount()).isEqualTo(DEFAULT_CONST_AMOUNT);
    }

    @Test
    @Transactional
    void createAssuranceWithExistingId() throws Exception {
        // Create the Assurance with an existing ID
        assurance.setId(1L);
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(assurance);

        int databaseSizeBeforeCreate = assuranceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssuranceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assuranceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAssurances() throws Exception {
        // Initialize the database
        assuranceRepository.saveAndFlush(assurance);

        // Get all the assuranceList
        restAssuranceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(assurance.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].constAmount").value(hasItem(DEFAULT_CONST_AMOUNT)));
    }

    @Test
    @Transactional
    void getAssurance() throws Exception {
        // Initialize the database
        assuranceRepository.saveAndFlush(assurance);

        // Get the assurance
        restAssuranceMockMvc
            .perform(get(ENTITY_API_URL_ID, assurance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(assurance.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.constAmount").value(DEFAULT_CONST_AMOUNT));
    }

    @Test
    @Transactional
    void getNonExistingAssurance() throws Exception {
        // Get the assurance
        restAssuranceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAssurance() throws Exception {
        // Initialize the database
        assuranceRepository.saveAndFlush(assurance);

        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();

        // Update the assurance
        Assurance updatedAssurance = assuranceRepository.findById(assurance.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAssurance are not directly saved in db
        em.detach(updatedAssurance);
        updatedAssurance.date(UPDATED_DATE).type(UPDATED_TYPE).constAmount(UPDATED_CONST_AMOUNT);
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(updatedAssurance);

        restAssuranceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, assuranceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(assuranceDTO))
            )
            .andExpect(status().isOk());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
        Assurance testAssurance = assuranceList.get(assuranceList.size() - 1);
        assertThat(testAssurance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testAssurance.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAssurance.getConstAmount()).isEqualTo(UPDATED_CONST_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingAssurance() throws Exception {
        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();
        assurance.setId(longCount.incrementAndGet());

        // Create the Assurance
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(assurance);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssuranceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, assuranceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(assuranceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAssurance() throws Exception {
        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();
        assurance.setId(longCount.incrementAndGet());

        // Create the Assurance
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(assurance);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssuranceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(assuranceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAssurance() throws Exception {
        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();
        assurance.setId(longCount.incrementAndGet());

        // Create the Assurance
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(assurance);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssuranceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assuranceDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAssuranceWithPatch() throws Exception {
        // Initialize the database
        assuranceRepository.saveAndFlush(assurance);

        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();

        // Update the assurance using partial update
        Assurance partialUpdatedAssurance = new Assurance();
        partialUpdatedAssurance.setId(assurance.getId());

        partialUpdatedAssurance.date(UPDATED_DATE).type(UPDATED_TYPE);

        restAssuranceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAssurance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAssurance))
            )
            .andExpect(status().isOk());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
        Assurance testAssurance = assuranceList.get(assuranceList.size() - 1);
        assertThat(testAssurance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testAssurance.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAssurance.getConstAmount()).isEqualTo(DEFAULT_CONST_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateAssuranceWithPatch() throws Exception {
        // Initialize the database
        assuranceRepository.saveAndFlush(assurance);

        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();

        // Update the assurance using partial update
        Assurance partialUpdatedAssurance = new Assurance();
        partialUpdatedAssurance.setId(assurance.getId());

        partialUpdatedAssurance.date(UPDATED_DATE).type(UPDATED_TYPE).constAmount(UPDATED_CONST_AMOUNT);

        restAssuranceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAssurance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAssurance))
            )
            .andExpect(status().isOk());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
        Assurance testAssurance = assuranceList.get(assuranceList.size() - 1);
        assertThat(testAssurance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testAssurance.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAssurance.getConstAmount()).isEqualTo(UPDATED_CONST_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingAssurance() throws Exception {
        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();
        assurance.setId(longCount.incrementAndGet());

        // Create the Assurance
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(assurance);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssuranceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, assuranceDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(assuranceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAssurance() throws Exception {
        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();
        assurance.setId(longCount.incrementAndGet());

        // Create the Assurance
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(assurance);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssuranceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(assuranceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAssurance() throws Exception {
        int databaseSizeBeforeUpdate = assuranceRepository.findAll().size();
        assurance.setId(longCount.incrementAndGet());

        // Create the Assurance
        AssuranceDTO assuranceDTO = assuranceMapper.toDto(assurance);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssuranceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(assuranceDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Assurance in the database
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAssurance() throws Exception {
        // Initialize the database
        assuranceRepository.saveAndFlush(assurance);

        int databaseSizeBeforeDelete = assuranceRepository.findAll().size();

        // Delete the assurance
        restAssuranceMockMvc
            .perform(delete(ENTITY_API_URL_ID, assurance.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Assurance> assuranceList = assuranceRepository.findAll();
        assertThat(assuranceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

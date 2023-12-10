package com.drivingschool.web.rest;

import com.drivingschool.repository.ReportsRepository;
import com.drivingschool.service.ReportsService;
import com.drivingschool.service.dto.ReportsDTO;
import com.drivingschool.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.drivingschool.domain.Reports}.
 */
@RestController
@RequestMapping("/api/reports")
public class ReportsResource {

    private final Logger log = LoggerFactory.getLogger(ReportsResource.class);

    private static final String ENTITY_NAME = "reports";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReportsService reportsService;

    private final ReportsRepository reportsRepository;

    public ReportsResource(ReportsService reportsService, ReportsRepository reportsRepository) {
        this.reportsService = reportsService;
        this.reportsRepository = reportsRepository;
    }

    /**
     * {@code POST  /reports} : Create a new reports.
     *
     * @param reportsDTO the reportsDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reportsDTO, or with status {@code 400 (Bad Request)} if the reports has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReportsDTO> createReports(@RequestBody ReportsDTO reportsDTO) throws URISyntaxException {
        log.debug("REST request to save Reports : {}", reportsDTO);
        if (reportsDTO.getId() != null) {
            throw new BadRequestAlertException("A new reports cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ReportsDTO result = reportsService.save(reportsDTO);
        return ResponseEntity
            .created(new URI("/api/reports/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /reports/:id} : Updates an existing reports.
     *
     * @param id the id of the reportsDTO to save.
     * @param reportsDTO the reportsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportsDTO,
     * or with status {@code 400 (Bad Request)} if the reportsDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reportsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReportsDTO> updateReports(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReportsDTO reportsDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Reports : {}, {}", id, reportsDTO);
        if (reportsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reportsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ReportsDTO result = reportsService.update(reportsDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportsDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /reports/:id} : Partial updates given fields of an existing reports, field will ignore if it is null
     *
     * @param id the id of the reportsDTO to save.
     * @param reportsDTO the reportsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportsDTO,
     * or with status {@code 400 (Bad Request)} if the reportsDTO is not valid,
     * or with status {@code 404 (Not Found)} if the reportsDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the reportsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReportsDTO> partialUpdateReports(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReportsDTO reportsDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Reports partially : {}, {}", id, reportsDTO);
        if (reportsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reportsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReportsDTO> result = reportsService.partialUpdate(reportsDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportsDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /reports} : get all the reports.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reports in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ReportsDTO>> getAllReports(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Reports");
        Page<ReportsDTO> page = reportsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reports/:id} : get the "id" reports.
     *
     * @param id the id of the reportsDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reportsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReportsDTO> getReports(@PathVariable Long id) {
        log.debug("REST request to get Reports : {}", id);
        Optional<ReportsDTO> reportsDTO = reportsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reportsDTO);
    }

    /**
     * {@code DELETE  /reports/:id} : delete the "id" reports.
     *
     * @param id the id of the reportsDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReports(@PathVariable Long id) {
        log.debug("REST request to delete Reports : {}", id);
        reportsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

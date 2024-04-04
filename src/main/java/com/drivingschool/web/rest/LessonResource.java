package com.drivingschool.web.rest;

import com.drivingschool.repository.LessonRepository;
import com.drivingschool.service.LessonService;
import com.drivingschool.service.dto.LessonDTO;
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
 * REST controller for managing {@link com.drivingschool.domain.Lesson}.
 */
@RestController
@RequestMapping("/api/lessons")
public class LessonResource {

    private final Logger log = LoggerFactory.getLogger(LessonResource.class);

    private static final String ENTITY_NAME = "lesson";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LessonService lessonService;

    private final LessonRepository lessonRepository;

    public LessonResource(LessonService lessonService, LessonRepository lessonRepository) {
        this.lessonService = lessonService;
        this.lessonRepository = lessonRepository;
    }

    /**
     * {@code POST  /lessons} : Create a new lesson.
     *
     * @param lessonDTO the lessonDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lessonDTO, or with status {@code 400 (Bad Request)} if the lesson has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LessonDTO> createLesson(@RequestBody LessonDTO lessonDTO) throws URISyntaxException {
        log.debug("REST request to save Lesson : {}", lessonDTO);
        if (lessonDTO.getId() != null) {
            throw new BadRequestAlertException("A new lesson cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LessonDTO result = lessonService.save(lessonDTO);
        return ResponseEntity
            .created(new URI("/api/lessons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lessons/:id} : Updates an existing lesson.
     *
     * @param id the id of the lessonDTO to save.
     * @param lessonDTO the lessonDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lessonDTO,
     * or with status {@code 400 (Bad Request)} if the lessonDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lessonDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LessonDTO> updateLesson(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LessonDTO lessonDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Lesson : {}, {}", id, lessonDTO);
        if (lessonDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lessonDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lessonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LessonDTO result = lessonService.update(lessonDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lessonDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lessons/:id} : Partial updates given fields of an existing lesson, field will ignore if it is null
     *
     * @param id the id of the lessonDTO to save.
     * @param lessonDTO the lessonDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lessonDTO,
     * or with status {@code 400 (Bad Request)} if the lessonDTO is not valid,
     * or with status {@code 404 (Not Found)} if the lessonDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the lessonDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LessonDTO> partialUpdateLesson(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LessonDTO lessonDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Lesson partially : {}, {}", id, lessonDTO);
        if (lessonDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lessonDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lessonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LessonDTO> result = lessonService.partialUpdate(lessonDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lessonDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /lessons} : get all the lessons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lessons in body.
     */
    @GetMapping("")
    public ResponseEntity<List<LessonDTO>> getAllLessons(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Lessons");
        Page<LessonDTO> page = lessonService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lessons/:id} : get the "id" lesson.
     *
     * @param id the id of the lessonDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lessonDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LessonDTO> getLesson(@PathVariable Long id) {
        log.debug("REST request to get Lesson : {}", id);
        Optional<LessonDTO> lessonDTO = lessonService.findOne(id);
        return ResponseUtil.wrapOrNotFound(lessonDTO);
    }

    /**
     * {@code DELETE  /lessons/:id} : delete the "id" lesson.
     *
     * @param id the id of the lessonDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        log.debug("REST request to delete Lesson : {}", id);
        lessonService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

package com.drivingschool.service;

import com.drivingschool.service.dto.DocumentsDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.drivingschool.domain.Documents}.
 */
public interface DocumentsService {
    /**
     * Save a documents.
     *
     * @param documentsDTO the entity to save.
     * @return the persisted entity.
     */
    DocumentsDTO save(DocumentsDTO documentsDTO);

    /**
     * Updates a documents.
     *
     * @param documentsDTO the entity to update.
     * @return the persisted entity.
     */
    DocumentsDTO update(DocumentsDTO documentsDTO);

    /**
     * Partially updates a documents.
     *
     * @param documentsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DocumentsDTO> partialUpdate(DocumentsDTO documentsDTO);

    /**
     * Get all the documents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DocumentsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" documents.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DocumentsDTO> findOne(Long id);

    /**
     * Delete the "id" documents.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}

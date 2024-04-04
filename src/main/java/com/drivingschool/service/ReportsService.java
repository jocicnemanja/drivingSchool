package com.drivingschool.service;

import com.drivingschool.service.dto.ReportsDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.drivingschool.domain.Reports}.
 */
public interface ReportsService {
    /**
     * Save a reports.
     *
     * @param reportsDTO the entity to save.
     * @return the persisted entity.
     */
    ReportsDTO save(ReportsDTO reportsDTO);

    /**
     * Updates a reports.
     *
     * @param reportsDTO the entity to update.
     * @return the persisted entity.
     */
    ReportsDTO update(ReportsDTO reportsDTO);

    /**
     * Partially updates a reports.
     *
     * @param reportsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ReportsDTO> partialUpdate(ReportsDTO reportsDTO);

    /**
     * Get all the reports.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ReportsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" reports.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ReportsDTO> findOne(Long id);

    /**
     * Delete the "id" reports.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}

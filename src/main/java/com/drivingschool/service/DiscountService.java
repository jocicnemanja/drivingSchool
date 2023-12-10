package com.drivingschool.service;

import com.drivingschool.service.dto.DiscountDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.drivingschool.domain.Discount}.
 */
public interface DiscountService {
    /**
     * Save a discount.
     *
     * @param discountDTO the entity to save.
     * @return the persisted entity.
     */
    DiscountDTO save(DiscountDTO discountDTO);

    /**
     * Updates a discount.
     *
     * @param discountDTO the entity to update.
     * @return the persisted entity.
     */
    DiscountDTO update(DiscountDTO discountDTO);

    /**
     * Partially updates a discount.
     *
     * @param discountDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DiscountDTO> partialUpdate(DiscountDTO discountDTO);

    /**
     * Get all the discounts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DiscountDTO> findAll(Pageable pageable);

    /**
     * Get the "id" discount.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DiscountDTO> findOne(Long id);

    /**
     * Delete the "id" discount.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}

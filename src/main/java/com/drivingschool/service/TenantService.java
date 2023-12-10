package com.drivingschool.service;

import com.drivingschool.service.dto.TenantDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.drivingschool.domain.Tenant}.
 */
public interface TenantService {
    /**
     * Save a tenant.
     *
     * @param tenantDTO the entity to save.
     * @return the persisted entity.
     */
    TenantDTO save(TenantDTO tenantDTO);

    /**
     * Updates a tenant.
     *
     * @param tenantDTO the entity to update.
     * @return the persisted entity.
     */
    TenantDTO update(TenantDTO tenantDTO);

    /**
     * Partially updates a tenant.
     *
     * @param tenantDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<TenantDTO> partialUpdate(TenantDTO tenantDTO);

    /**
     * Get all the tenants.
     *
     * @return the list of entities.
     */
    List<TenantDTO> findAll();

    /**
     * Get the "id" tenant.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TenantDTO> findOne(Long id);

    /**
     * Delete the "id" tenant.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}

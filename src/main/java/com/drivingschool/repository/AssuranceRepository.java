package com.drivingschool.repository;

import com.drivingschool.domain.Assurance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Assurance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssuranceRepository extends JpaRepository<Assurance, Long> {}

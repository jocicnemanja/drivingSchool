package com.drivingschool.service.mapper;

import com.drivingschool.domain.Reports;
import com.drivingschool.service.dto.ReportsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Reports} and its DTO {@link ReportsDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReportsMapper extends EntityMapper<ReportsDTO, Reports> {}

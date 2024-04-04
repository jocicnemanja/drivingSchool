package com.drivingschool.service.mapper;

import com.drivingschool.domain.Tenant;
import com.drivingschool.service.dto.TenantDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Tenant} and its DTO {@link TenantDTO}.
 */
@Mapper(componentModel = "spring")
public interface TenantMapper extends EntityMapper<TenantDTO, Tenant> {}

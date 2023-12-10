package com.drivingschool.service.mapper;

import com.drivingschool.domain.Assurance;
import com.drivingschool.domain.Student;
import com.drivingschool.service.dto.AssuranceDTO;
import com.drivingschool.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Assurance} and its DTO {@link AssuranceDTO}.
 */
@Mapper(componentModel = "spring")
public interface AssuranceMapper extends EntityMapper<AssuranceDTO, Assurance> {
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    AssuranceDTO toDto(Assurance s);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}

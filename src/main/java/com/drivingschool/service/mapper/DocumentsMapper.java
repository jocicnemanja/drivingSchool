package com.drivingschool.service.mapper;

import com.drivingschool.domain.Documents;
import com.drivingschool.domain.Student;
import com.drivingschool.service.dto.DocumentsDTO;
import com.drivingschool.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Documents} and its DTO {@link DocumentsDTO}.
 */
@Mapper(componentModel = "spring")
public interface DocumentsMapper extends EntityMapper<DocumentsDTO, Documents> {
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    DocumentsDTO toDto(Documents s);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}

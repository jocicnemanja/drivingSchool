package com.drivingschool.service.mapper;

import com.drivingschool.domain.Exam;
import com.drivingschool.domain.Student;
import com.drivingschool.service.dto.ExamDTO;
import com.drivingschool.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Exam} and its DTO {@link ExamDTO}.
 */
@Mapper(componentModel = "spring")
public interface ExamMapper extends EntityMapper<ExamDTO, Exam> {
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    ExamDTO toDto(Exam s);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}

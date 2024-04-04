package com.drivingschool.service.mapper;

import com.drivingschool.domain.Lesson;
import com.drivingschool.domain.Student;
import com.drivingschool.service.dto.LessonDTO;
import com.drivingschool.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Lesson} and its DTO {@link LessonDTO}.
 */
@Mapper(componentModel = "spring")
public interface LessonMapper extends EntityMapper<LessonDTO, Lesson> {
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    LessonDTO toDto(Lesson s);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}

package com.drivingschool.service.mapper;

import com.drivingschool.domain.Discount;
import com.drivingschool.domain.Student;
import com.drivingschool.service.dto.DiscountDTO;
import com.drivingschool.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Discount} and its DTO {@link DiscountDTO}.
 */
@Mapper(componentModel = "spring")
public interface DiscountMapper extends EntityMapper<DiscountDTO, Discount> {
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    DiscountDTO toDto(Discount s);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}

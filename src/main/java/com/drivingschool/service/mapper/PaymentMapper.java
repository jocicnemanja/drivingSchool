package com.drivingschool.service.mapper;

import com.drivingschool.domain.Payment;
import com.drivingschool.domain.Student;
import com.drivingschool.service.dto.PaymentDTO;
import com.drivingschool.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Payment} and its DTO {@link PaymentDTO}.
 */
@Mapper(componentModel = "spring")
public interface PaymentMapper extends EntityMapper<PaymentDTO, Payment> {
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    PaymentDTO toDto(Payment s);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}

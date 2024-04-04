package com.drivingschool.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.drivingschool.domain.Exam} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExamDTO implements Serializable {

    private Long id;

    private ZonedDateTime date;

    private String type;

    private Integer constAmount;

    private StudentDTO student;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getConstAmount() {
        return constAmount;
    }

    public void setConstAmount(Integer constAmount) {
        this.constAmount = constAmount;
    }

    public StudentDTO getStudent() {
        return student;
    }

    public void setStudent(StudentDTO student) {
        this.student = student;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExamDTO)) {
            return false;
        }

        ExamDTO examDTO = (ExamDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, examDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExamDTO{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", type='" + getType() + "'" +
            ", constAmount=" + getConstAmount() +
            ", student=" + getStudent() +
            "}";
    }
}

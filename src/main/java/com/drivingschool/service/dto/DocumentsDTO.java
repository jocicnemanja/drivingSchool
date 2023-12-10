package com.drivingschool.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.drivingschool.domain.Documents} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DocumentsDTO implements Serializable {

    private Long id;

    private String name;

    private String type;

    private StudentDTO student;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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
        if (!(o instanceof DocumentsDTO)) {
            return false;
        }

        DocumentsDTO documentsDTO = (DocumentsDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, documentsDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocumentsDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", student=" + getStudent() +
            "}";
    }
}

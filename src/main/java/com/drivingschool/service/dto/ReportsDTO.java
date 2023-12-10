package com.drivingschool.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.drivingschool.domain.Reports} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReportsDTO implements Serializable {

    private Long id;

    private String name;

    private String type;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReportsDTO)) {
            return false;
        }

        ReportsDTO reportsDTO = (ReportsDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, reportsDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReportsDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}

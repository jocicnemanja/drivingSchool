package com.drivingschool.domain;

import static com.drivingschool.domain.AssuranceTestSamples.*;
import static com.drivingschool.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.drivingschool.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AssuranceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Assurance.class);
        Assurance assurance1 = getAssuranceSample1();
        Assurance assurance2 = new Assurance();
        assertThat(assurance1).isNotEqualTo(assurance2);

        assurance2.setId(assurance1.getId());
        assertThat(assurance1).isEqualTo(assurance2);

        assurance2 = getAssuranceSample2();
        assertThat(assurance1).isNotEqualTo(assurance2);
    }

    @Test
    void studentTest() throws Exception {
        Assurance assurance = getAssuranceRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        assurance.setStudent(studentBack);
        assertThat(assurance.getStudent()).isEqualTo(studentBack);

        assurance.student(null);
        assertThat(assurance.getStudent()).isNull();
    }
}

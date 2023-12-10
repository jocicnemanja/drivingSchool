package com.drivingschool.domain;

import static com.drivingschool.domain.ExamTestSamples.*;
import static com.drivingschool.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.drivingschool.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExamTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Exam.class);
        Exam exam1 = getExamSample1();
        Exam exam2 = new Exam();
        assertThat(exam1).isNotEqualTo(exam2);

        exam2.setId(exam1.getId());
        assertThat(exam1).isEqualTo(exam2);

        exam2 = getExamSample2();
        assertThat(exam1).isNotEqualTo(exam2);
    }

    @Test
    void studentTest() throws Exception {
        Exam exam = getExamRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        exam.setStudent(studentBack);
        assertThat(exam.getStudent()).isEqualTo(studentBack);

        exam.student(null);
        assertThat(exam.getStudent()).isNull();
    }
}

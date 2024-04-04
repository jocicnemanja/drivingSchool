package com.drivingschool.domain;

import static com.drivingschool.domain.LessonTestSamples.*;
import static com.drivingschool.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.drivingschool.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LessonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Lesson.class);
        Lesson lesson1 = getLessonSample1();
        Lesson lesson2 = new Lesson();
        assertThat(lesson1).isNotEqualTo(lesson2);

        lesson2.setId(lesson1.getId());
        assertThat(lesson1).isEqualTo(lesson2);

        lesson2 = getLessonSample2();
        assertThat(lesson1).isNotEqualTo(lesson2);
    }

    @Test
    void studentTest() throws Exception {
        Lesson lesson = getLessonRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        lesson.setStudent(studentBack);
        assertThat(lesson.getStudent()).isEqualTo(studentBack);

        lesson.student(null);
        assertThat(lesson.getStudent()).isNull();
    }
}

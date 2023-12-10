package com.drivingschool.domain;

import static com.drivingschool.domain.AssuranceTestSamples.*;
import static com.drivingschool.domain.DiscountTestSamples.*;
import static com.drivingschool.domain.DocumentsTestSamples.*;
import static com.drivingschool.domain.ExamTestSamples.*;
import static com.drivingschool.domain.LessonTestSamples.*;
import static com.drivingschool.domain.PaymentTestSamples.*;
import static com.drivingschool.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.drivingschool.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class StudentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Student.class);
        Student student1 = getStudentSample1();
        Student student2 = new Student();
        assertThat(student1).isNotEqualTo(student2);

        student2.setId(student1.getId());
        assertThat(student1).isEqualTo(student2);

        student2 = getStudentSample2();
        assertThat(student1).isNotEqualTo(student2);
    }

    @Test
    void paymentTest() throws Exception {
        Student student = getStudentRandomSampleGenerator();
        Payment paymentBack = getPaymentRandomSampleGenerator();

        student.addPayment(paymentBack);
        assertThat(student.getPayments()).containsOnly(paymentBack);
        assertThat(paymentBack.getStudent()).isEqualTo(student);

        student.removePayment(paymentBack);
        assertThat(student.getPayments()).doesNotContain(paymentBack);
        assertThat(paymentBack.getStudent()).isNull();

        student.payments(new HashSet<>(Set.of(paymentBack)));
        assertThat(student.getPayments()).containsOnly(paymentBack);
        assertThat(paymentBack.getStudent()).isEqualTo(student);

        student.setPayments(new HashSet<>());
        assertThat(student.getPayments()).doesNotContain(paymentBack);
        assertThat(paymentBack.getStudent()).isNull();
    }

    @Test
    void lessonTest() throws Exception {
        Student student = getStudentRandomSampleGenerator();
        Lesson lessonBack = getLessonRandomSampleGenerator();

        student.addLesson(lessonBack);
        assertThat(student.getLessons()).containsOnly(lessonBack);
        assertThat(lessonBack.getStudent()).isEqualTo(student);

        student.removeLesson(lessonBack);
        assertThat(student.getLessons()).doesNotContain(lessonBack);
        assertThat(lessonBack.getStudent()).isNull();

        student.lessons(new HashSet<>(Set.of(lessonBack)));
        assertThat(student.getLessons()).containsOnly(lessonBack);
        assertThat(lessonBack.getStudent()).isEqualTo(student);

        student.setLessons(new HashSet<>());
        assertThat(student.getLessons()).doesNotContain(lessonBack);
        assertThat(lessonBack.getStudent()).isNull();
    }

    @Test
    void assuranceTest() throws Exception {
        Student student = getStudentRandomSampleGenerator();
        Assurance assuranceBack = getAssuranceRandomSampleGenerator();

        student.addAssurance(assuranceBack);
        assertThat(student.getAssurances()).containsOnly(assuranceBack);
        assertThat(assuranceBack.getStudent()).isEqualTo(student);

        student.removeAssurance(assuranceBack);
        assertThat(student.getAssurances()).doesNotContain(assuranceBack);
        assertThat(assuranceBack.getStudent()).isNull();

        student.assurances(new HashSet<>(Set.of(assuranceBack)));
        assertThat(student.getAssurances()).containsOnly(assuranceBack);
        assertThat(assuranceBack.getStudent()).isEqualTo(student);

        student.setAssurances(new HashSet<>());
        assertThat(student.getAssurances()).doesNotContain(assuranceBack);
        assertThat(assuranceBack.getStudent()).isNull();
    }

    @Test
    void examTest() throws Exception {
        Student student = getStudentRandomSampleGenerator();
        Exam examBack = getExamRandomSampleGenerator();

        student.addExam(examBack);
        assertThat(student.getExams()).containsOnly(examBack);
        assertThat(examBack.getStudent()).isEqualTo(student);

        student.removeExam(examBack);
        assertThat(student.getExams()).doesNotContain(examBack);
        assertThat(examBack.getStudent()).isNull();

        student.exams(new HashSet<>(Set.of(examBack)));
        assertThat(student.getExams()).containsOnly(examBack);
        assertThat(examBack.getStudent()).isEqualTo(student);

        student.setExams(new HashSet<>());
        assertThat(student.getExams()).doesNotContain(examBack);
        assertThat(examBack.getStudent()).isNull();
    }

    @Test
    void discountTest() throws Exception {
        Student student = getStudentRandomSampleGenerator();
        Discount discountBack = getDiscountRandomSampleGenerator();

        student.addDiscount(discountBack);
        assertThat(student.getDiscounts()).containsOnly(discountBack);
        assertThat(discountBack.getStudent()).isEqualTo(student);

        student.removeDiscount(discountBack);
        assertThat(student.getDiscounts()).doesNotContain(discountBack);
        assertThat(discountBack.getStudent()).isNull();

        student.discounts(new HashSet<>(Set.of(discountBack)));
        assertThat(student.getDiscounts()).containsOnly(discountBack);
        assertThat(discountBack.getStudent()).isEqualTo(student);

        student.setDiscounts(new HashSet<>());
        assertThat(student.getDiscounts()).doesNotContain(discountBack);
        assertThat(discountBack.getStudent()).isNull();
    }

    @Test
    void documentsTest() throws Exception {
        Student student = getStudentRandomSampleGenerator();
        Documents documentsBack = getDocumentsRandomSampleGenerator();

        student.addDocuments(documentsBack);
        assertThat(student.getDocuments()).containsOnly(documentsBack);
        assertThat(documentsBack.getStudent()).isEqualTo(student);

        student.removeDocuments(documentsBack);
        assertThat(student.getDocuments()).doesNotContain(documentsBack);
        assertThat(documentsBack.getStudent()).isNull();

        student.documents(new HashSet<>(Set.of(documentsBack)));
        assertThat(student.getDocuments()).containsOnly(documentsBack);
        assertThat(documentsBack.getStudent()).isEqualTo(student);

        student.setDocuments(new HashSet<>());
        assertThat(student.getDocuments()).doesNotContain(documentsBack);
        assertThat(documentsBack.getStudent()).isNull();
    }
}

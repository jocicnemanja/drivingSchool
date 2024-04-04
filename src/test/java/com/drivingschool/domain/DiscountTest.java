package com.drivingschool.domain;

import static com.drivingschool.domain.DiscountTestSamples.*;
import static com.drivingschool.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.drivingschool.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DiscountTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Discount.class);
        Discount discount1 = getDiscountSample1();
        Discount discount2 = new Discount();
        assertThat(discount1).isNotEqualTo(discount2);

        discount2.setId(discount1.getId());
        assertThat(discount1).isEqualTo(discount2);

        discount2 = getDiscountSample2();
        assertThat(discount1).isNotEqualTo(discount2);
    }

    @Test
    void studentTest() throws Exception {
        Discount discount = getDiscountRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        discount.setStudent(studentBack);
        assertThat(discount.getStudent()).isEqualTo(studentBack);

        discount.student(null);
        assertThat(discount.getStudent()).isNull();
    }
}

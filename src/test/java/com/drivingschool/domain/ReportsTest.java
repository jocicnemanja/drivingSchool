package com.drivingschool.domain;

import static com.drivingschool.domain.ReportsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.drivingschool.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReportsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reports.class);
        Reports reports1 = getReportsSample1();
        Reports reports2 = new Reports();
        assertThat(reports1).isNotEqualTo(reports2);

        reports2.setId(reports1.getId());
        assertThat(reports1).isEqualTo(reports2);

        reports2 = getReportsSample2();
        assertThat(reports1).isNotEqualTo(reports2);
    }
}

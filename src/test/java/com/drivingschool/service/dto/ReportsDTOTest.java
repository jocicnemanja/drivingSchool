package com.drivingschool.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.drivingschool.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReportsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReportsDTO.class);
        ReportsDTO reportsDTO1 = new ReportsDTO();
        reportsDTO1.setId(1L);
        ReportsDTO reportsDTO2 = new ReportsDTO();
        assertThat(reportsDTO1).isNotEqualTo(reportsDTO2);
        reportsDTO2.setId(reportsDTO1.getId());
        assertThat(reportsDTO1).isEqualTo(reportsDTO2);
        reportsDTO2.setId(2L);
        assertThat(reportsDTO1).isNotEqualTo(reportsDTO2);
        reportsDTO1.setId(null);
        assertThat(reportsDTO1).isNotEqualTo(reportsDTO2);
    }
}

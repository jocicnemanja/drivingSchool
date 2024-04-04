package com.drivingschool.domain;

import static com.drivingschool.domain.DocumentsTestSamples.*;
import static com.drivingschool.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.drivingschool.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocumentsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Documents.class);
        Documents documents1 = getDocumentsSample1();
        Documents documents2 = new Documents();
        assertThat(documents1).isNotEqualTo(documents2);

        documents2.setId(documents1.getId());
        assertThat(documents1).isEqualTo(documents2);

        documents2 = getDocumentsSample2();
        assertThat(documents1).isNotEqualTo(documents2);
    }

    @Test
    void studentTest() throws Exception {
        Documents documents = getDocumentsRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        documents.setStudent(studentBack);
        assertThat(documents.getStudent()).isEqualTo(studentBack);

        documents.student(null);
        assertThat(documents.getStudent()).isNull();
    }
}

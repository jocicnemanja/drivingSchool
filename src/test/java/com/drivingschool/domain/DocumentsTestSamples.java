package com.drivingschool.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DocumentsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Documents getDocumentsSample1() {
        return new Documents().id(1L).name("name1").type("type1");
    }

    public static Documents getDocumentsSample2() {
        return new Documents().id(2L).name("name2").type("type2");
    }

    public static Documents getDocumentsRandomSampleGenerator() {
        return new Documents().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).type(UUID.randomUUID().toString());
    }
}

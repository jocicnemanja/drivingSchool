package com.drivingschool.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReportsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Reports getReportsSample1() {
        return new Reports().id(1L).name("name1").type("type1");
    }

    public static Reports getReportsSample2() {
        return new Reports().id(2L).name("name2").type("type2");
    }

    public static Reports getReportsRandomSampleGenerator() {
        return new Reports().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).type(UUID.randomUUID().toString());
    }
}

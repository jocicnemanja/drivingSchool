package com.drivingschool.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AssuranceTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Assurance getAssuranceSample1() {
        return new Assurance().id(1L).type("type1").constAmount(1);
    }

    public static Assurance getAssuranceSample2() {
        return new Assurance().id(2L).type("type2").constAmount(2);
    }

    public static Assurance getAssuranceRandomSampleGenerator() {
        return new Assurance().id(longCount.incrementAndGet()).type(UUID.randomUUID().toString()).constAmount(intCount.incrementAndGet());
    }
}

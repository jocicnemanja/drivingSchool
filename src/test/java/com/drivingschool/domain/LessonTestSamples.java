package com.drivingschool.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LessonTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Lesson getLessonSample1() {
        return new Lesson().id(1L).type("type1").costAmount(1);
    }

    public static Lesson getLessonSample2() {
        return new Lesson().id(2L).type("type2").costAmount(2);
    }

    public static Lesson getLessonRandomSampleGenerator() {
        return new Lesson().id(longCount.incrementAndGet()).type(UUID.randomUUID().toString()).costAmount(intCount.incrementAndGet());
    }
}

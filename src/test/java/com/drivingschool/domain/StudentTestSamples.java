package com.drivingschool.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class StudentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Student getStudentSample1() {
        return new Student()
            .id(1L)
            .firstName("firstName1")
            .middleName("middleName1")
            .lastName("lastName1")
            .contractNumber("contractNumber1")
            .phoneNumber("phoneNumber1")
            .jmbg("jmbg1");
    }

    public static Student getStudentSample2() {
        return new Student()
            .id(2L)
            .firstName("firstName2")
            .middleName("middleName2")
            .lastName("lastName2")
            .contractNumber("contractNumber2")
            .phoneNumber("phoneNumber2")
            .jmbg("jmbg2");
    }

    public static Student getStudentRandomSampleGenerator() {
        return new Student()
            .id(longCount.incrementAndGet())
            .firstName(UUID.randomUUID().toString())
            .middleName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .contractNumber(UUID.randomUUID().toString())
            .phoneNumber(UUID.randomUUID().toString())
            .jmbg(UUID.randomUUID().toString());
    }
}

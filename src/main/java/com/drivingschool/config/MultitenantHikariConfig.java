package com.drivingschool.config;

import com.zaxxer.hikari.HikariConfig;

import javax.sql.DataSource;

public class MultitenantHikariConfig extends HikariConfig {
    public MultitenantHikariConfig(String tenantId) {
        setJdbcUrl("jdbc:postgresql://localhost:5432/" + tenantId); // Example URL
        setUsername("admin");
        setPassword("admin");
        setAutoCommit(false);
        setPoolName("Hikari");
        // Configure other HikariCP properties as needed
    }

}

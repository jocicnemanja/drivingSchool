package com.drivingschool.config;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.boot.jdbc.DataSourceBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
//
//import javax.sql.DataSource;
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.IOException;
//import java.nio.file.Paths;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Properties;
//
//@Configuration
//public class MultitenantConfiguration {
//    private final Logger log = LoggerFactory.getLogger(DatabaseConfiguration.class);
//
//    @Value("${defaultTenant}")
//    private String defaultTenant;
//
////    @Bean
////    @ConfigurationProperties(prefix = "tenants")
////    public DataSource dataSource() {
////        log.debug("<<<<<<<<<<<<<<<<<<< USO >>>>>>>>>>>>>>>");
////        File[] files = Paths.get("allTenants").toFile().listFiles();
////        Map<Object, Object> resolvedDataSources = new HashMap<>();
////        log.debug("<<<<<<<<<<<<<<<<<<< Fajlovi ocitao >>>>>>>>>>>>>>>", files.length);
////
////        for (File propertyFile : files) {
////            Properties tenantProperties = new Properties();
////            DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
////
////            try {
////                tenantProperties.load(new FileInputStream(propertyFile));
////                String tenantId = tenantProperties.getProperty("name");
////
////                dataSourceBuilder.driverClassName(tenantProperties.getProperty("datasource.driver-class-name"));
////                dataSourceBuilder.username(tenantProperties.getProperty("datasource.username"));
////                dataSourceBuilder.password(tenantProperties.getProperty("datasource.password"));
////                dataSourceBuilder.url(tenantProperties.getProperty("datasource.url"));
////                dataSourceBuilder.type(com.zaxxer.hikari.HikariDataSource.class);
////
////                log.debug("<<<<<<<<<<<<<<<<<<< POSTVAVIO JE DATA SOURCE >>>>>>>>>>>>>>>", tenantId);
////
////                resolvedDataSources.put(tenantId, dataSourceBuilder.build());
////            } catch (IOException exp) {
////                throw new RuntimeException("Problem in tenant datasource:" + exp);
////            }
////        }
////
////        AbstractRoutingDataSource dataSource = new MultitenantDataSource();
////        dataSource.setDefaultTargetDataSource(resolvedDataSources.get(defaultTenant));
////        dataSource.setTargetDataSources(resolvedDataSources);
////
////        log.debug("<<<<<<<<<<<<<<<<<<< POSTVAVIO JE DATA SOURCE >>>>>>>>>>>>>>>");
////
////        dataSource.afterPropertiesSet();
////        return dataSource;
////    }
//
//}


import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class MultitenantConfiguration {

    @Bean
    public DataSource multitenantDataSource() {
        MultitenantDataSource dataSource = new MultitenantDataSource();
        dataSource.setTargetDataSources(targetDataSources());
        dataSource.setDefaultTargetDataSource(defaultDataSource());
        return dataSource;
    }

    private Map<Object, Object> targetDataSources() {
        Map<Object, Object> targetDataSources = new HashMap<>();
        // Populate the map with tenant-specific data sources
        // Example:
         targetDataSources.put("tenant_1", new HikariDataSource(new MultitenantHikariConfig("tenant_1")));
         targetDataSources.put("tenant_2", new HikariDataSource( new MultitenantHikariConfig("tenant_2")));
        return targetDataSources;
    }

    private DataSource defaultDataSource() {
        // Set a default data source for cases where the tenant is not explicitly specified
        return new HikariDataSource( new MultitenantHikariConfig("tenant_2"));
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        return new DataSourceTransactionManager(multitenantDataSource());
    }
}

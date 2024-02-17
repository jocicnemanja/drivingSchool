package com.drivingschool.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class MultitenantDataSource extends AbstractRoutingDataSource {

    private final Logger log = LoggerFactory.getLogger(MultitenantDataSource.class);

    @Override
    protected String determineCurrentLookupKey() {

        log.debug( "Current tenant >>>>>>> : ", TenantContext.getCurrentTenant() );
        return TenantContext.getCurrentTenant();
    }
}

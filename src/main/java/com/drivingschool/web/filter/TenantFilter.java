package com.drivingschool.web.filter;

import com.drivingschool.config.LoggingConfiguration;
import com.drivingschool.config.MultitenantConfiguration;
import com.drivingschool.config.TenantContext;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@Order(1)
class TenantFilter implements Filter {

    private final Logger log = LoggerFactory.getLogger(TenantFilter.class);
    @Autowired
    private  final MultitenantConfiguration multitenantConfiguration;

    TenantFilter(MultitenantConfiguration multitenantConfiguration) {
        this.multitenantConfiguration = multitenantConfiguration;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String tenantName = req.getHeader("X-TenantID");

        log.info("__________________________ TEST ____________________");
        log.info("__________________________ TENANT ID ____________________");
        log.info("_____________________________ " + tenantName + "------------------------------");

        TenantContext.setCurrentTenant(tenantName);
        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.setCurrentTenant("tenant_1");
        }
    }
}

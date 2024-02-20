package com.drivingschool.web.filter;
import com.drivingschool.config.MultitenantConfiguration;
import com.drivingschool.config.TenantContext;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

@Component
@Order(1)
class TenantFilter implements Filter {
    private final Logger log = LoggerFactory.getLogger(TenantFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
            try {
                HttpServletRequest req = (HttpServletRequest) request;
                String tenantName = req.getHeader("X-Tenantname");

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (tenantName == null && authentication != null && authentication.getPrincipal() instanceof Jwt) {
                    Jwt jwtToken = (Jwt) authentication.getPrincipal();
                    tenantName = jwtToken.getClaimAsString("tenantName");
                }

                log.info("___________________ TEST ____________________");
                log.info("_________________ TENANT ID _________________");
                log.info("_____________ " + tenantName + "------------");

                TenantContext.setCurrentTenant(tenantName);
                chain.doFilter(request, response);
            } finally {
                TenantContext.setCurrentTenant("tenant_1");
            }

    }

}

package com.hotel.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name="Habte",
                        email = "habtadugna@gmail.com"
                ),
                description = """
                        OpenApi Documentation For Hotel Order Management Web App developed
                        using Spring Boot
                        """,
                title = "Hotel Order Management API Documentation",
                version = "1.0"
        ),
        servers = {
                @Server(
                        description = "LOCAL ENV",
                        url = "http:localhost:8088/api/v1"
                )
        },
        security = {
                @SecurityRequirement(
                        name="Bearer Auth"
                )
        }
)
@SecurityScheme(
        name = "Bearer Auth",
        description = "JWT auth description",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}

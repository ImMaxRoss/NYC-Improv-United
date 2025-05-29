package com.phas1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {
	
	@Bean
	public OpenAPI springShopOpenAPI() {
		return new OpenAPI().info(new Info().title("ImprovCoach")
			.description("Improv Coach API")
			.version("v1")
			.contact(new Contact().name("Max Ross").url("https://github.com/ImMaxRoss").email("max@maxross.com"))
			.license(new License().name("License").url("https://www.youtube.com/watch?v=E4m_M0JwGLI&list=PL3r1ldjYHlYObJvxYuJBYx3vD9OZSlAxJ")));
	}
	
}
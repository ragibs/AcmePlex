package com.acmeplex.acmeplex_backend;

import com.acmeplex.acmeplex_backend.config.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(RsaKeyProperties.class)
@SpringBootApplication
public class AcmeplexBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcmeplexBackendApplication.class, args);
	}

}

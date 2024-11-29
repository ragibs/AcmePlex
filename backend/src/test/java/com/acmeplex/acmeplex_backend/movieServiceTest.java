package com.acmeplex.acmeplex_backend;

import com.acmeplex.acmeplex_backend.service.MovieService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest
public class movieServiceTest {

    @Autowired
    private MovieService movieService;

    @Test
    public void testEmailServiceInjection() {
        assertNotNull(movieService.getEmailService());
    }
}
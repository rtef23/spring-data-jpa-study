package com.personal.study.config;

import java.nio.charset.StandardCharsets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CharacterEncodingFilter;

@Configuration
public class WebConfig {
  @Bean
  public CharacterEncodingFilter characterEncodingFilter(){
    CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();

    characterEncodingFilter.setEncoding(StandardCharsets.UTF_8.name());
    characterEncodingFilter.setForceEncoding(true);

    return characterEncodingFilter;
  }
}

package com.personal.study.presentation.dto;

import lombok.Getter;

@Getter
public class MovieDTO {
  private String name;
  private Long price;
  private Integer stockQuantity;

  private String director;
  private String actor;
}

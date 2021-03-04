package com.personal.study.presentation.dto;

import lombok.Getter;

@Getter
public class BookDTO {
  private String name;
  private Long price;
  private Integer stockQuantity;

  private String author;
  private String isbn;
}

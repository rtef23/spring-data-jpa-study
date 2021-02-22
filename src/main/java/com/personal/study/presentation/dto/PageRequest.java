package com.personal.study.presentation.dto;

import lombok.Getter;

@Getter
public class PageRequest {
  private static final int MAX_SIZE = 50;
  private static final int DEFAULT_SIZE = 10;

  private int page;
  private int size;

  public void setPage(int page) {
    this.page = page <= 0 ? 1 : page;
  }

  public void setSize(int size) {
    this.size = size <= MAX_SIZE ? size : DEFAULT_SIZE;
  }

  public org.springframework.data.domain.PageRequest of() {
    return org.springframework.data.domain.PageRequest.of(page - 1, size);
  }
}

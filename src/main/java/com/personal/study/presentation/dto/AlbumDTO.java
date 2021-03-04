package com.personal.study.presentation.dto;

import lombok.Getter;

@Getter
public class AlbumDTO {
  private String name;
  private Long price;
  private Integer stockQuantity;

  private String artist;
  private String etc;
}

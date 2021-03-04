package com.personal.study.presentation.dto;

import com.personal.study.domain.constant.ItemType;
import lombok.Getter;
import lombok.Setter;

@Getter
public class ItemDTO {
  @Setter
  private ItemType itemType;

  private String name;
  private Long price;
  private Integer stockQuantity;

  private String artist;
  private String etc;

  private String author;
  private String isbn;

  private String director;
  private String actor;
}

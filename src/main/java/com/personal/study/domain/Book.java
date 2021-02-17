package com.personal.study.domain;

import javax.persistence.DiscriminatorValue;

@DiscriminatorValue(value = "Book")
public class Book extends Item {
  private String author;

  private String isbn;
}

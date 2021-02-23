package com.personal.study.domain;

import com.personal.study.util.Mergeable;
import javax.persistence.DiscriminatorValue;

@DiscriminatorValue(value = "Book")
public class Book extends Item implements Mergeable<Book> {
  private String author;

  private String isbn;
}

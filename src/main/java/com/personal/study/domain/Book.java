package com.personal.study.domain;

import com.personal.study.util.Mergeable;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value = "Book")
public class Book extends Item implements Mergeable<Book> {
  private String author;

  private String isbn;
}

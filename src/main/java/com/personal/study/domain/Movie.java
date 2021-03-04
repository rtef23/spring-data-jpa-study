package com.personal.study.domain;

import com.personal.study.util.Mergeable;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value = "Movie")
public class Movie extends Item implements Mergeable<Movie> {
  private String director;

  private String actor;
}

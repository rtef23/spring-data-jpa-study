package com.personal.study.domain;

import javax.persistence.DiscriminatorValue;

@DiscriminatorValue(value = "Movie")
public class Movie extends Item {
  private String director;

  private String actor;
}

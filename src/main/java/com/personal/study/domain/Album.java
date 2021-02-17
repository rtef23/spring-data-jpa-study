package com.personal.study.domain;

import javax.persistence.DiscriminatorValue;

@DiscriminatorValue(value = "Album")
public class Album extends Item {
  private String artist;

  private String etc;
}

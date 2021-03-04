package com.personal.study.domain;

import com.personal.study.util.Mergeable;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value = "Album")
public class Album extends Item implements Mergeable<Album> {
  private String artist;

  private String etc;
}

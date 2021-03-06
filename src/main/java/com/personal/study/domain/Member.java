package com.personal.study.domain;

import com.personal.study.domain.value.Address;
import com.personal.study.util.Mergeable;
import com.personal.study.util.annotation.ExcludeMerge;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import lombok.Getter;

@Entity
@Getter
public class Member implements Mergeable<Member> {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "member_id")
  @ExcludeMerge
  private Long id;

  private String name;

  @Embedded private Address address;

  @OneToMany(mappedBy = "member")
  private List<Order> orders = new ArrayList<>();
}

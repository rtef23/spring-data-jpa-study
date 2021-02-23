package com.personal.study.domain;

import com.personal.study.domain.constant.DeliveryStatus;
import com.personal.study.domain.value.Address;
import com.personal.study.util.Mergeable;
import com.personal.study.util.annotation.ExcludeMerge;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity
public class Delivery implements Mergeable<Delivery> {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "delivery_id")
  @ExcludeMerge
  private Long id;

  @OneToOne(fetch = FetchType.LAZY, mappedBy = "delivery")
  private Order order;

  @Embedded private Address address;

  @Enumerated(value = EnumType.STRING)
  private DeliveryStatus status;

  protected void setOrder(Order order) {
    this.order = order;
  }
}

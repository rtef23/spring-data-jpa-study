package com.personal.study.domain;

import com.personal.study.domain.constant.DeliveryStatus;
import com.personal.study.domain.value.Address;
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
public class Delivery {
  @Id
  @GeneratedValue(strategy = GenerationType.TABLE)
  @Column(name = "delivery_id")
  private Long id;

  @OneToOne(fetch = FetchType.LAZY, mappedBy = "delivery")
  private Order order;

  @Embedded private Address address;

  @Enumerated(value = EnumType.STRING)
  private DeliveryStatus deliveryStatus;

  protected void setOrder(Order order) {
    this.order = order;
  }
}

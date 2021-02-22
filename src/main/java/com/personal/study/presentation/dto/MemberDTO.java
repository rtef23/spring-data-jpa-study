package com.personal.study.presentation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberDTO {
  private Long id;
  private String name;
  private String addressCity;
  private String addressStreet;
  private String addressZipcode;
}

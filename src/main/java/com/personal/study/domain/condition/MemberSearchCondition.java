package com.personal.study.domain.condition;

import com.personal.study.domain.constant.MemberSearchType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberSearchCondition {
  private MemberSearchType keywordType;
  private String keyword;
}

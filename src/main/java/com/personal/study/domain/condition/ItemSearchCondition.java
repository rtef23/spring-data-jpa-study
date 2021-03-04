package com.personal.study.domain.condition;

import com.personal.study.domain.constant.ItemType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemSearchCondition {
  private ItemType itemType;
  private String name;
}

package com.personal.study.domain;

import com.personal.study.util.Mergeable;
import com.personal.study.util.annotation.ExcludeMerge;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import lombok.Getter;

@Entity
@Getter
public class Category implements Mergeable<Category> {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "category_id")
  @ExcludeMerge
  private Long id;

  private String name;

  @ManyToMany
  @JoinTable(
      name = "CATEGORY_ITEM",
      joinColumns = @JoinColumn(name = "category_id"),
      inverseJoinColumns = @JoinColumn(name = "item_id"))
  private List<Item> items = new ArrayList<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_id")
  private Category parent;

  @OneToMany(mappedBy = "parent")
  private List<Category> children = new ArrayList<>();

  protected void setParent(Category category) {
    this.parent = category;
  }

  public void addChild(Category category) {
    this.children.add(category);
    category.setParent(this);
  }
}

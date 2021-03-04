package com.personal.study.infrastructure;

import com.personal.study.application.exception.ResourceNotExistException;
import com.personal.study.domain.Album;
import com.personal.study.domain.Book;
import com.personal.study.domain.Item;
import com.personal.study.domain.Movie;
import com.personal.study.domain.condition.ItemSearchCondition;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
public class ItemCustomRepositoryImpl implements ItemCustomRepository {
  private final EntityManager entityManager;

  /*
  TODO change with QueryDSL
   */
  @Override
  @Transactional(readOnly = true)
  public Page<Item> findPagedItems(ItemSearchCondition searchCondition, Pageable pageable) {
    String conditionalCountQuery = "SELECT COUNT(i) FROM Item i";
    String conditionalSelectQuery = "SELECT i FROM Item i";

    TypedQuery<Long> countQuery;
    TypedQuery<Item> selectQuery;

    if (Objects.nonNull(searchCondition.getItemType())
        || Objects.nonNull(searchCondition.getName())) {
      boolean isConditionAppended = false;
      String condition = " WHERE ";

      if (!Objects.isNull(searchCondition.getItemType())) {
        isConditionAppended = true;

        switch (searchCondition.getItemType()) {
          case ALBUM:
            condition += "TYPE(i) = Album";
            break;
          case BOOK:
            condition += "TYPE(i) = Book";
            break;
          case MOVIE:
            condition += "TYPE(i) = Movie";
            break;
          default:
        }
      }

      if (!Objects.isNull(searchCondition.getName())) {
        if (isConditionAppended) {
          condition += " AND ";
        }

        condition += "i.name LIKE CONCAT(:name, '%')";
      }

      conditionalCountQuery += condition;
      conditionalSelectQuery += condition;
    }

    countQuery = entityManager.createQuery(conditionalCountQuery, Long.class);
    selectQuery = entityManager.createQuery(conditionalSelectQuery, Item.class);

    if (Objects.nonNull(searchCondition.getName())) {
      countQuery = countQuery.setParameter("name", searchCondition.getName());
      selectQuery = selectQuery.setParameter("name", searchCondition.getName());
    }

    Long totalItemCount = countQuery.getSingleResult();
    List<Item> pagedItems =
        totalItemCount > 0 ? selectQuery.getResultList() : Collections.emptyList();

    return new PageImpl<>(pagedItems, pageable, totalItemCount);
  }

  @Override
  @Transactional
  public Book modifyBook(Long id, Book updateValue) {
    Book targetItem = entityManager.find(Book.class, id);

    if (Objects.isNull(targetItem)) {
      throw new ResourceNotExistException("book is not exist. id : " + id);
    }

    targetItem.merge(updateValue);

    return targetItem;
  }

  @Override
  public Album modifyAlbum(Long id, Album updateValue) {
    Album targetItem = entityManager.find(Album.class, id);

    if (Objects.isNull(targetItem)) {
      throw new ResourceNotExistException("album is not exist. id : " + id);
    }

    targetItem.merge(updateValue);

    return targetItem;
  }

  @Override
  public Movie modifyMovie(Long id, Movie updateValue) {
    Movie targetItem = entityManager.find(Movie.class, id);

    if (Objects.isNull(targetItem)) {
      throw new ResourceNotExistException("movie is not exist. id : " + id);
    }

    targetItem.merge(updateValue);

    return targetItem;
  }

  @Override
  @Transactional
  public void removeItem(Long id) {
    Item foundItem = entityManager.find(Item.class, id);

    if (Objects.isNull(foundItem)) {
      throw new ResourceNotExistException("item is not exist. id : " + id);
    }

    entityManager.remove(foundItem);
  }
}

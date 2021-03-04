package com.personal.study.infrastructure;

import com.personal.study.domain.Album;
import com.personal.study.domain.Book;
import com.personal.study.domain.Item;
import com.personal.study.domain.Movie;
import com.personal.study.domain.condition.ItemSearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ItemCustomRepository {
  Page<Item> findPagedItems(ItemSearchCondition searchCondition, Pageable pageable);

  Book modifyBook(Long id, Book updateValue);

  Album modifyAlbum(Long id, Album updateValue);

  Movie modifyMovie(Long id, Movie updateValue);

  void removeItem(Long id);
}

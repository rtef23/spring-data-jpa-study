package com.personal.study.application.service;

import com.personal.study.domain.Album;
import com.personal.study.domain.Book;
import com.personal.study.domain.Item;
import com.personal.study.domain.Movie;
import com.personal.study.domain.condition.ItemSearchCondition;
import com.personal.study.infrastructure.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {
  private final ItemRepository itemRepository;

  public Page<Item> getPagedItems(ItemSearchCondition itemSearchCondition, Pageable pageable) {
    return itemRepository.findPagedItems(itemSearchCondition, pageable);
  }

  public <T extends Item> void addItem(T addValue) {
    itemRepository.save(addValue);
  }

  public void modifyBook(Long id, Book updateValue) {
    itemRepository.modifyBook(id, updateValue);
  }

  public void modifyAlbum(Long id, Album updateValue) {
    itemRepository.modifyAlbum(id, updateValue);
  }

  public void modifyMovie(Long id, Movie updateValue) {
    itemRepository.modifyMovie(id, updateValue);
  }

  public void removeItem(Long id) {
    itemRepository.removeItem(id);
  }
}

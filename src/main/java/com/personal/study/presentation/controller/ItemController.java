package com.personal.study.presentation.controller;

import com.personal.study.application.service.ItemService;
import com.personal.study.domain.Album;
import com.personal.study.domain.Book;
import com.personal.study.domain.Movie;
import com.personal.study.domain.condition.ItemSearchCondition;
import com.personal.study.presentation.dto.AlbumDTO;
import com.personal.study.presentation.dto.BookDTO;
import com.personal.study.presentation.dto.ItemDTO;
import com.personal.study.presentation.dto.MovieDTO;
import com.personal.study.presentation.dto.PageRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ItemController {
  private final ModelMapper modelMapper;
  private final ItemService itemService;

  @GetMapping("/v1/items")
  public Page<ItemDTO> searchItems(ItemSearchCondition searchCondition, PageRequest pageRequest) {
    return itemService
        .getPagedItems(searchCondition, pageRequest.of())
        .map((item) -> modelMapper.map(item, ItemDTO.class));
  }

  @PostMapping("/v1/items/books")
  public void addBook(@Validated @RequestBody BookDTO bookDTO) {
    itemService.addItem(modelMapper.map(bookDTO, Book.class));
  }

  @PatchMapping("/v1/items/books/{id}")
  public void modifyBook(@PathVariable Long id, @Validated @RequestBody BookDTO bookDTO) {
    itemService.modifyBook(id, modelMapper.map(bookDTO, Book.class));
  }

  @PostMapping("/v1/items/albums")
  public void addAlbum(@Validated @RequestBody AlbumDTO albumDTO) {
    itemService.addItem(modelMapper.map(albumDTO, Album.class));
  }

  @PatchMapping("/v1/items/albums/{id}")
  public void modifyAlbum(@PathVariable Long id, @Validated @RequestBody AlbumDTO albumDTO) {
    itemService.modifyAlbum(id, modelMapper.map(albumDTO, Album.class));
  }

  @PostMapping("/v1/items/movies")
  public void addMovie(@Validated @RequestBody MovieDTO movieDTO) {
    itemService.addItem(modelMapper.map(movieDTO, Movie.class));
  }

  @PatchMapping("/v1/items/movies/{id}")
  public void modifyMovie(@PathVariable Long id, @Validated @RequestBody MovieDTO movieDTO) {
    itemService.modifyMovie(id, modelMapper.map(movieDTO, Movie.class));
  }

  @DeleteMapping("/v1/items/{id}")
  public void removeBook(@PathVariable Long id) {
    itemService.removeItem(id);
  }
}

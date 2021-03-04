package com.personal.study.config;

import com.personal.study.domain.Album;
import com.personal.study.domain.Book;
import com.personal.study.domain.Movie;
import com.personal.study.domain.constant.ItemType;
import com.personal.study.presentation.dto.ItemDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration.AccessLevel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
  @Bean
  public ModelMapper modelMapper() {
    ModelMapper modelMapper = new ModelMapper();

    modelMapper
        .getConfiguration()
        .setFieldAccessLevel(AccessLevel.PRIVATE)
        .setFieldMatchingEnabled(true);

    modelMapper
        .typeMap(Album.class, ItemDTO.class)
        .addMapping(album -> ItemType.ALBUM, ItemDTO::setItemType);

    modelMapper
        .typeMap(Book.class, ItemDTO.class)
        .addMapping(book -> ItemType.BOOK, ItemDTO::setItemType);

    modelMapper
        .typeMap(Movie.class, ItemDTO.class)
        .addMapping(book -> ItemType.MOVIE, ItemDTO::setItemType);

    return modelMapper;
  }
}

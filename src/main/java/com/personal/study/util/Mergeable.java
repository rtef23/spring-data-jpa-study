package com.personal.study.util;

import com.personal.study.util.annotation.ExcludeMerge;
import com.personal.study.util.exception.MergeException;
import java.lang.reflect.Field;
import java.util.Objects;

public interface Mergeable<T> {
  default void merge(T updateValue) {
    try {
      for (Class<?> currentClazz = this.getClass();
          currentClazz != Object.class;
          currentClazz = currentClazz.getSuperclass()) {
        for (Field field : currentClazz.getDeclaredFields()) {
          if (field.isAnnotationPresent(ExcludeMerge.class)) {
            continue;
          }

          field.setAccessible(true);

          Object updateFieldValue = field.get(updateValue);

          if (Objects.isNull(updateFieldValue)) {
            continue;
          }

          field.set(this, updateFieldValue);
        }
      }
    } catch (IllegalAccessException e) {
      throw new MergeException(e);
    }
  }
}

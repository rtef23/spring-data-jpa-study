package com.personal.study.application.exception;

public class ResourceNotExistException extends RuntimeException {

  public ResourceNotExistException(String message) {
    super(message);
  }

  public ResourceNotExistException(Throwable cause) {
    super(cause);
  }
}

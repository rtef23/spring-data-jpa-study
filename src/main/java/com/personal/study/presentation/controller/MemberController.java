package com.personal.study.presentation.controller;

import com.personal.study.application.exception.ResourceNotExistException;
import com.personal.study.application.service.MemberService;
import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import com.personal.study.presentation.dto.MemberDTO;
import com.personal.study.presentation.dto.PageRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberController {
  private final ModelMapper modelMapper;
  private final MemberService memberService;

  @GetMapping("/v1/members")
  public Page<MemberDTO> searchMembers(
      MemberSearchCondition searchCondition, PageRequest pageRequest) {
    return memberService
        .getPagedMembers(searchCondition, pageRequest.of())
        .map((member) -> modelMapper.map(member, MemberDTO.class));
  }

  @PostMapping("/v1/members")
  public void addMember(@RequestBody MemberDTO memberDTO) {
    memberService.addMember(modelMapper.map(memberDTO, Member.class));
  }

  @PatchMapping("/v1/members/{id}")
  public void modifyMember(@PathVariable Long id, @RequestBody MemberDTO memberDTO) {
    memberService.modifyMember(id, modelMapper.map(memberDTO, Member.class));
  }

  @DeleteMapping("/v1/members/{id}")
  public void removeMember(@PathVariable Long id) {
    memberService.removeMember(id);
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler(ResourceNotExistException.class)
  public void handleResourceNotExistException() {}
}

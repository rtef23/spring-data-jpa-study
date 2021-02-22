package com.personal.study.presentation.controller;

import com.personal.study.application.service.MemberService;
import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import com.personal.study.presentation.dto.MemberDTO;
import com.personal.study.presentation.dto.PageRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
  public void addMembers(@RequestBody MemberDTO memberDTO) {
    memberService.addMembers(modelMapper.map(memberDTO, Member.class));
  }
}

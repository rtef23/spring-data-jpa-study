package com.personal.study.application.service;

import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import com.personal.study.infrastructure.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {
  private final MemberRepository memberRepository;

  public Page<Member> getPagedMembers(MemberSearchCondition searchCondition, Pageable pageable) {
    return memberRepository.findPagedMembers(searchCondition, pageable);
  }

  public void addMembers(Member member) {
    memberRepository.save(member);
  }
}

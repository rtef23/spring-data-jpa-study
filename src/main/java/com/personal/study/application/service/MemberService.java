package com.personal.study.application.service;

import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import com.personal.study.infrastructure.MemberRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {
  private final MemberRepository memberRepository;

  public List<Member> getMembers(MemberSearchCondition searchCondition) {
    return memberRepository.findMembers(searchCondition);
  }

  public void addMembers(Member member) {
    memberRepository.save(member);
  }
}

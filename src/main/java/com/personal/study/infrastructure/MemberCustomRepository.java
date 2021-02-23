package com.personal.study.infrastructure;

import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MemberCustomRepository {
  Page<Member> findPagedMembers(MemberSearchCondition searchCondition, Pageable pageable);

  Member modifyMember(Long id, Member updateValue);

  void removeMember(Long id);
}

package com.personal.study.infrastructure;

import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import java.util.List;

public interface MemberCustomRepository {
  List<Member> findMembers(MemberSearchCondition searchCondition);
}

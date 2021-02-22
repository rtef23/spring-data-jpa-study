package com.personal.study.infrastructure;

import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import java.util.List;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class MemberCustomRepositoryImpl implements MemberCustomRepository {
  private final EntityManager entityManager;

  @Override
  public List<Member> findMembers(MemberSearchCondition searchCondition) {
    return entityManager
        .createQuery("SELECT m FROM Member m", Member.class)
        .setFirstResult(searchCondition.getPagination().getStartRow())
        .setMaxResults(searchCondition.getPagination().getOffset())
        .getResultList();
  }
}

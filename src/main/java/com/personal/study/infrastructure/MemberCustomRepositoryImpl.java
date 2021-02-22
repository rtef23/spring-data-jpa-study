package com.personal.study.infrastructure;

import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@RequiredArgsConstructor
public class MemberCustomRepositoryImpl implements MemberCustomRepository {
  private final EntityManager entityManager;

  @Override
  public Page<Member> findPagedMembers(MemberSearchCondition searchCondition, Pageable pageable) {
    Long totalMemberCount =
        entityManager.createQuery("SELECT COUNT(m) FROM Member m", Long.class).getSingleResult();

    List<Member> pagedMembers =
        totalMemberCount > 0
            ? entityManager
                .createQuery("SELECT m FROM Member m", Member.class)
                .setFirstResult(pageable.getPageNumber())
                .setMaxResults(pageable.getPageSize())
                .getResultList()
            : Collections.emptyList();

    return new PageImpl<>(pagedMembers, pageable, totalMemberCount);
  }
}

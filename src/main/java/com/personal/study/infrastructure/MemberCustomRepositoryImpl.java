package com.personal.study.infrastructure;

import com.personal.study.application.exception.ResourceNotExistException;
import com.personal.study.domain.Member;
import com.personal.study.domain.condition.MemberSearchCondition;
import com.personal.study.domain.constant.MemberSearchType;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
public class MemberCustomRepositoryImpl implements MemberCustomRepository {
  private final EntityManager entityManager;

  /*
  TODO change with QueryDSL
   */
  @Override
  @Transactional(readOnly = true)
  public Page<Member> findPagedMembers(MemberSearchCondition searchCondition, Pageable pageable) {
    StringBuilder conditionalCountQuery = new StringBuilder("SELECT COUNT(m) FROM Member m");
    StringBuilder conditionalSelectQuery = new StringBuilder("SELECT m FROM Member m");

    TypedQuery<Long> countQuery;
    TypedQuery<Member> selectQuery;

    if (Objects.isNull(searchCondition.getKeywordType())) {
      countQuery = entityManager.createQuery(conditionalCountQuery.toString(), Long.class);
      selectQuery = entityManager.createQuery(conditionalSelectQuery.toString(), Member.class);
    } else {
      if (searchCondition.getKeywordType() == MemberSearchType.NAME) {
        conditionalCountQuery.append(" WHERE m.name LIKE CONCAT(:keyword, '%')");
        conditionalSelectQuery.append(" WHERE m.name LIKE CONCAT(:keyword, '%')");

      } else {
        conditionalCountQuery.append(" WHERE m.address.street LIKE CONCAT(:keyword, '%')");
        conditionalSelectQuery.append(" WHERE m.address.street LIKE CONCAT(:keyword, '%')");
      }

      countQuery =
          entityManager
              .createQuery(conditionalCountQuery.toString(), Long.class)
              .setParameter("keyword", searchCondition.getKeyword());
      selectQuery =
          entityManager
              .createQuery(conditionalSelectQuery.toString(), Member.class)
              .setParameter("keyword", searchCondition.getKeyword())
              .setFirstResult(pageable.getPageNumber())
              .setMaxResults(pageable.getPageSize());
    }

    Long totalMemberCount = countQuery.getSingleResult();

    List<Member> pagedMembers =
        totalMemberCount > 0 ? selectQuery.getResultList() : Collections.emptyList();

    return new PageImpl<>(pagedMembers, pageable, totalMemberCount);
  }

  @Override
  @Transactional
  public Member modifyMember(Long id, Member updateValue) {
    Member targetMember = findManagedMemberEntity(id);

    targetMember.merge(updateValue);

    return targetMember;
  }

  @Override
  @Transactional
  public void removeMember(Long id) {
    Member targetMember = findManagedMemberEntity(id);

    entityManager.remove(targetMember);
  }

  private Member findManagedMemberEntity(Long id) {
    Member foundMember = entityManager.find(Member.class, id);

    if (Objects.isNull(foundMember)) {
      throw new ResourceNotExistException("member not founded.");
    }

    return foundMember;
  }
}

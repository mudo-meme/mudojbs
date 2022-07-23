package com.mudomeme.mudojbs.db.repository;

import com.mudomeme.mudojbs.db.entity.Image;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Objects;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.util.StringUtils;

import static com.mudomeme.mudojbs.db.entity.QImage.image;
import static com.mudomeme.mudojbs.db.entity.QTag.tag;
import static com.mudomeme.mudojbs.db.entity.QImageTag.imageTag;

public class ImageCustomRepositoryImpl extends QuerydslRepositorySupport implements ImageCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Autowired
    public ImageCustomRepositoryImpl(JPAQueryFactory jpaQueryFactory) {
        super(Image.class);
        this.jpaQueryFactory = jpaQueryFactory;
    }

    @Override
    public Page<Image> pageBy(Pageable pageable) {
        JPQLQuery<Image> query = Objects.requireNonNull(getQuerydsl())
            .applyPagination(pageable, from(image));

        return PageableExecutionUtils.getPage(query.fetch(), pageable, query::fetchCount);
    }

    @Override
    public Page<Image> pageByName(Pageable pageable, String name) {
        JPQLQuery<Image> query = Objects.requireNonNull(getQuerydsl())
            .applyPagination(pageable, from(image))
            .where(image.id.in(
                JPAExpressions
                    .select(imageTag.image.id)
                    .from(imageTag)
                    .where(eqImageTagName(name))));

        return PageableExecutionUtils.getPage(query.fetch(), pageable, query::fetchCount);
    }

    @Override
    public List<Image> listByRandom(Integer size) {
        TypedQuery<Image> query = getEntityManager().createQuery(
            "select i from Image i order by RAND()", Image.class)
            .setMaxResults(size);

        return query.getResultList();
    }

    private BooleanExpression eqImageTagName(String name) {
        if (StringUtils.hasText(name)) {
            return imageTag.tag.name.eq(name);
        }
        return null;
    }
}

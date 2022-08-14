package com.mudomeme.mudojbs.db.repository;

import com.mudomeme.mudojbs.api.response.TagDetailRes;
import com.mudomeme.mudojbs.db.entity.Image;
import com.mudomeme.mudojbs.db.entity.Tag;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import static com.mudomeme.mudojbs.db.entity.QImageTag.imageTag;

public class TagCustomRepositoryImpl extends QuerydslRepositorySupport implements TagCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Autowired
    public TagCustomRepositoryImpl(JPAQueryFactory jpaQueryFactory) {
        super(Image.class);
        this.jpaQueryFactory = jpaQueryFactory;
    }

    @Override
    public List<TagDetailRes> searchTag(String tagName, Long size) {
        StringPath aliasQuantity = Expressions.stringPath("imageCount");

        JPAQuery<TagDetailRes> query = jpaQueryFactory.select(
                Projections.constructor(TagDetailRes.class,
                    imageTag.tag.name.as("tag"),
                    imageTag.id.count().as("imageCount"))
            )
            .from(imageTag)
            .where(imageTag.tag.name.contains(tagName))
            .groupBy(imageTag.tag.name)
            .orderBy(aliasQuantity.desc())
            .limit(size);

        return query.fetch();
    }
}

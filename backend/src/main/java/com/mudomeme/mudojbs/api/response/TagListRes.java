package com.mudomeme.mudojbs.api.response;

import com.mudomeme.mudojbs.db.entity.Tag;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TagListRes {
    private String name;

    public static TagListRes of(Tag tag) {
        return TagListRes.builder()
            .name(tag.getName())
            .build();
    }
}

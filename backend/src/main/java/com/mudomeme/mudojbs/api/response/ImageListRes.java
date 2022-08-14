package com.mudomeme.mudojbs.api.response;

import com.mudomeme.mudojbs.db.entity.Image;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ImageListRes {
    private Long id;
    private String imageUrl;
    private Long viewCount;

    public static ImageListRes of(Image image) {
        return ImageListRes.builder()
            .id(image.getId())
            .imageUrl(image.getImageUrl())
            .viewCount(image.getViewCount())
            .build();
    }
}

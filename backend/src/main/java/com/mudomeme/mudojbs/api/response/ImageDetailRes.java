package com.mudomeme.mudojbs.api.response;

import com.mudomeme.mudojbs.db.entity.Image;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ImageDetailRes {
    private Long id;
    private String imageUrl;
    private List<TagListRes> tags;

    public static ImageDetailRes of(Image image) {
        return ImageDetailRes.builder()
            .id(image.getId())
            .imageUrl(image.getImageUrl())
            .tags(image.getImageTags().stream().map(imageTag -> TagListRes.of(imageTag.getTag())).collect(
                Collectors.toList()))
            .build();
    }
}

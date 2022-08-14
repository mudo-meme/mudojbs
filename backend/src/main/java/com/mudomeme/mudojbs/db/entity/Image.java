package com.mudomeme.mudojbs.db.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id")
@ToString
public class Image extends BaseEntity {

    @NotNull
    private String imageUrl;

    @NotNull
    private Long viewCount = 0L;

    @OneToMany(mappedBy = "image")
    private List<ImageTag> imageTags = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public Image(String imageUrl) {
        this.imageUrl = imageUrl;
        this.viewCount = 0L;
        this.imageTags = new ArrayList<>();
    }

    public void setImageTags(List<ImageTag> imageTags) {
        this.imageTags = imageTags;
    }

    public void plusViewCount() {
        this.viewCount += 1;
    }
}

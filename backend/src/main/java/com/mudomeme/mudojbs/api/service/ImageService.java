package com.mudomeme.mudojbs.api.service;

import com.mudomeme.mudojbs.db.entity.Image;
import com.mudomeme.mudojbs.db.entity.ImageTag;
import com.mudomeme.mudojbs.db.entity.Tag;
import com.mudomeme.mudojbs.db.repository.ImageRepository;
import com.mudomeme.mudojbs.db.repository.ImageTagRepository;
import com.mudomeme.mudojbs.db.repository.TagRepository;
import com.mudomeme.mudojbs.exception.ApiException;
import com.mudomeme.mudojbs.exception.enums.ExceptionEnum;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final AmazonS3Service amazonS3Service;
    private final ImageRepository imageRepository;
    private final TagRepository tagRepository;
    private final ImageTagRepository imageTagRepository;

    @Transactional
    public Image saveImage(List<String> tags, MultipartFile image) {
        // s3에 이미지 저장
        String imageUrl = amazonS3Service.uploadFile(image);

        // image 저장
        Image newImage = Image.builder()
            .imageUrl(imageUrl)
            .build();

        newImage = imageRepository.save(newImage);

        // tag 저장
        List<Tag> reqTags = tags
            .stream().map(
                name -> Tag.builder()
                    .name(name)
                    .build())
            .collect(Collectors.toList());

        List<Tag> newTags = tagRepository.saveAll(reqTags);

        // imageTag 저장
        List<ImageTag> imageTags = new ArrayList<>();
        for(Tag tag: newTags) {
            ImageTag imageTag = ImageTag.builder()
                .image(newImage)
                .tag(tag)
                .build();
            imageTags.add(imageTag);
        }

        List<ImageTag> newImageTags = imageTagRepository.saveAll(imageTags);

        // newImage에 newImageTags 전달
        newImage.setImageTags(newImageTags);

        return newImage;
    }

    @Transactional(readOnly = true)
    public Page<Image> pageByName(Pageable pageable, String query) {
        Page<Image> images = imageRepository.pageByName(pageable, query);
        return images;
    }

    @Transactional(readOnly = true)
    public Page<Image> pageImages(Pageable pageable) {
        Page<Image> images = imageRepository.pageBy(pageable);
        return images;
    }

    @Transactional(readOnly = true)
    public List<Image> listRandomImages(Integer size) {
        List<Image> images = imageRepository.listByRandom(size);
        return images;
    }

    @Transactional(readOnly = true)
    public Image getImage(Long id) {
        Image image = imageRepository.findById(id)
            .orElseThrow(() -> new ApiException(ExceptionEnum.IMAGE_NOT_FOUND));
        return image;
    }
}

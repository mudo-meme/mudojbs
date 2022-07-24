package com.mudomeme.mudojbs.api.controller;

import com.mudomeme.mudojbs.api.response.ImageDetailRes;
import com.mudomeme.mudojbs.api.response.ImageListRes;
import com.mudomeme.mudojbs.api.service.ImageService;
import com.mudomeme.mudojbs.db.entity.Image;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ImageDetailRes> saveImage(@RequestPart List<String> tags,
        @RequestPart MultipartFile image) {
        Image resImage = imageService.saveImage(tags, image);
        ImageDetailRes res = ImageDetailRes.of(resImage);

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping
    public ResponseEntity<Page<ImageListRes>> pageImages(
        @PageableDefault(size = 50, sort = "viewCount", direction = Direction.DESC) Pageable pageable,
        @RequestParam(defaultValue = "") String query
    ) {
        Page<Image> images = imageService.pageByName(pageable, query);
        Page<ImageListRes> res = images.map(image -> ImageListRes.of(image));

        return ResponseEntity.ok(res);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<ImageListRes>> pagePopularImages(
        @PageableDefault(size = 10, sort = "viewCount", direction = Direction.DESC) Pageable pageable
    ) {
        Page<Image> images = imageService.pageImages(pageable);
        List<ImageListRes> res = images.map(image -> ImageListRes.of(image)).toList();

        return ResponseEntity.ok(res);
    }

    @GetMapping("/new")
    public ResponseEntity<List<ImageListRes>> pageNewImages(
        @PageableDefault(size = 10, sort = "createdAt", direction = Direction.DESC) Pageable pageable
    ) {
        Page<Image> images = imageService.pageImages(pageable);
        List<ImageListRes> res = images.map(image -> ImageListRes.of(image)).toList();

        return ResponseEntity.ok(res);
    }

    @GetMapping("/random")
    public ResponseEntity<List<ImageListRes>> listRandomImages(@RequestParam(defaultValue = "50") Integer size) {
        List<Image> images = imageService.listRandomImages(size);
        List<ImageListRes> res = images.stream().map(image -> ImageListRes.of(image))
            .collect(Collectors.toList());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageDetailRes> getImage(@PathVariable Long id) {
        Image image = imageService.getImage(id);
        ImageDetailRes res = ImageDetailRes.of(image);

        return ResponseEntity.ok(res);
    }

}

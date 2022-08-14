package com.mudomeme.mudojbs.api.controller;

import com.mudomeme.mudojbs.api.response.ImageListRes;
import com.mudomeme.mudojbs.api.response.TagDetailRes;
import com.mudomeme.mudojbs.api.service.TagService;
import com.mudomeme.mudojbs.db.entity.Image;
import com.mudomeme.mudojbs.db.entity.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagDetailRes>> searchTag(
        @RequestParam(defaultValue = "") String query,
        @RequestParam(defaultValue = "5") Long size
    ) {
        List<TagDetailRes> res = tagService.searchTag(query, size);

        return ResponseEntity.ok(res);
    }
}

package com.mudomeme.mudojbs.api.service;

import com.mudomeme.mudojbs.api.response.TagDetailRes;
import com.mudomeme.mudojbs.db.repository.TagRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<TagDetailRes> searchTag(String query, Long size) {
        List<TagDetailRes> res = tagRepository.searchTag(query, size);
        return res;
    }
}

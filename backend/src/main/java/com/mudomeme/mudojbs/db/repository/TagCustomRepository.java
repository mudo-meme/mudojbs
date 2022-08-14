package com.mudomeme.mudojbs.db.repository;

import com.mudomeme.mudojbs.api.response.TagDetailRes;
import java.util.List;

public interface TagCustomRepository {
    List<TagDetailRes> searchTag(String query, Long size);
}

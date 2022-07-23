package com.mudomeme.mudojbs.db.repository;

import com.mudomeme.mudojbs.db.entity.Image;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ImageCustomRepository {
    Page<Image> pageBy(Pageable pageable);
    Page<Image> pageByName(Pageable pageable, String query);
    List<Image> listByRandom(Integer size);
}

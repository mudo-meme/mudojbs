package com.mudomeme.mudojbs.db.repository;

import com.mudomeme.mudojbs.db.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, String>, TagCustomRepository {
}

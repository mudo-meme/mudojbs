package com.mudomeme.mudojbs.db.repository;

import com.mudomeme.mudojbs.db.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long>, ImageCustomRepository {
}

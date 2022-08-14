package com.mudomeme.mudojbs.api.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TagDetailRes {
    private final String tag;
    private final Long imageCount;
}

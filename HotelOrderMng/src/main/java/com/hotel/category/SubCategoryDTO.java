package com.hotel.category;

import java.util.List;

public record SubCategoryDTO(
        String parentCategoryId,
        List<String> subCategoryIds
){}

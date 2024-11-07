package com.hotel.common;

import lombok.Builder;

import java.util.List;

@Builder
public record PageResponse<T>(
        List<T> content,
        int number,
        int size,
        int totalElements,
        int totalPages,
        boolean last,
        boolean first,
        boolean empty
) {}

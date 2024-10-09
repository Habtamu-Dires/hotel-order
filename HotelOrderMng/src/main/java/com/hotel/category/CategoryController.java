package com.hotel.category;

import com.hotel.api_response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryDTO>> getAllCategory(){
        List<CategoryDTO> res = categoryService.getAllCategory();
        return ApiResponse.<List<CategoryDTO>>builder()
                .success(true)
                .data(res)
                .message("List of Categories")
                .build();
    }

    @GetMapping("/main")
    public ApiResponse<List<CategoryDTO>> getMainCategories(){
        List<CategoryDTO> res = categoryService.getMainCategories();
        return ApiResponse.<List<CategoryDTO>>builder()
                .success(true)
                .data(res)
                .message("List of Categories")
                .build();
    }

    @PostMapping
    public ApiResponse<?> createCategory(
            @RequestBody CategoryDTO categoryDTO
    ){
        categoryService.createCategory(categoryDTO);
        return ApiResponse.builder()
                .success(true)
                .data(null)
                .message(String.format("Category %s created", categoryDTO.name()))
                .build();
    }

    //add-subCategory
    @PostMapping("/sub-category")
    public ApiResponse<?> addSubCategory(
            @RequestBody SubCategoryDTO subCategoryDTO
    ){
        categoryService.addSubCategory(subCategoryDTO);
        return ApiResponse.builder()
                .success(true)
                .data(null)
                .message("SubCategory Created")
                .build();
    }
}

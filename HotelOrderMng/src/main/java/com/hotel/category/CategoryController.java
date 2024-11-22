package com.hotel.category;

import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/categories")
@Tag(name = "categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    // save category
    @PostMapping
    public ResponseEntity<IdResponse> saveCategory(
            @RequestBody @Valid CategoryRequest request
    ){
        return ResponseEntity.ok(service.saveCategory(request));
    }

    // get all categories
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategory(){
       return ResponseEntity.ok(service.getAllCategory());
    }

    // get pageable categories
    @GetMapping("/page")
    public ResponseEntity<PageResponse<CategoryResponse>> getPageOfCategories(
            @RequestParam(value="page",defaultValue="0", required = false) int page,
            @RequestParam(value = "size",defaultValue="0", required = false) int size
    ){
        return ResponseEntity.ok(service.getPagesOfCategories(page,size));
    }
    // get category by id
    @GetMapping("/{category-id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable("category-id") String categoryId
    ){
        return ResponseEntity.ok(service.getCategoryId(categoryId));
    }

    // get main categories
    @GetMapping("/main")
    public ResponseEntity<List<CategoryResponse>> getMainCategories(){
        return ResponseEntity.ok(service.getMainCategories());
    }

    // get pages of main categories
    @GetMapping("/main/page")
    public ResponseEntity<PageResponse<CategoryResponse>> getPagesOfMainCategories(
            @RequestParam(value="page",defaultValue="0", required = false) int page,
            @RequestParam(value = "size",defaultValue="0", required = false) int size
    ){
        return ResponseEntity.ok(service.getPagesOfMainCategory(page,size));
    }

    // get pages of sub categories
    @GetMapping("/sub/page")
    public ResponseEntity<PageResponse<CategoryResponse>> getPagesOfSubCategories(
            @RequestParam(value="page",defaultValue="0", required = false) int page,
            @RequestParam(value = "size",defaultValue="0", required = false) int size
    ){
        return ResponseEntity.ok(service.getPagesOfSubCategory(page,size));
    }


    //upload cover image
    @PostMapping(value = "/cover-picture/{category-id}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadCoverPicture (
            @PathVariable("category-id") String categoryId,
            @RequestPart MultipartFile file
            )
    {
        service.uploadCoverPicture(categoryId, file);
        return ResponseEntity.accepted().build();
    }

    //delete category
    @DeleteMapping("/{category-id}")
    public ResponseEntity<?> deleteCategory(
            @PathVariable("category-id") String  categoryId
    ) {
        service.deleteCategory(categoryId);
        return ResponseEntity.accepted().build();
    }

    //searching
    @GetMapping("/search/name/{category-name}")
    public ResponseEntity<List<CategoryResponse>> searchCategoryByName(
            @PathVariable("category-name") String categoryName,
            @RequestParam("filter") String filter
    ){
        return ResponseEntity.ok(service.searchCategoryByName(categoryName, filter));
    }


}

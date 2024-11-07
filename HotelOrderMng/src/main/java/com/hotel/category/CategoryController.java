package com.hotel.category;

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

    //save category
    @PostMapping
    public ResponseEntity<String> saveCategory(
            @RequestBody @Valid CategoryRequest request
    ){
        return ResponseEntity.ok(service.saveCategory(request));
    }

    // get all categories
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategory(){
       return ResponseEntity.ok(service.getAllCategory());
    }

    // get main categories
    @GetMapping("/main")
    public ResponseEntity<List<CategoryResponse>> getMainCategories(){
        return ResponseEntity.ok(service.getMainCategories());
    }


    //upload cover image
    @PostMapping(value = "/cover-picture/{category-id}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadCoverPicture(
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

}

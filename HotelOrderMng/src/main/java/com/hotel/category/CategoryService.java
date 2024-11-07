package com.hotel.category;

import com.hotel.file.FileStorageService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final CategoryMapper mapper;
    private final FileStorageService fileStorageService;

    // save category
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public String saveCategory(@Valid  CategoryRequest request) {
    Category category = Category.builder()
            .name(request.name())
            .build();

      if(request.id() == null) {
          repository.findByName(request.name())
              .ifPresent(c -> {
                      throw new EntityExistsException(String.format("Category with name %s already exists", request.name()));
                  });
          category.setId(UUID.randomUUID());
      } else{
          category.setId(UUID.fromString(request.id()));
      }

      if(request.parentCategoryId() != null){
         Category parentCategory = this.findCategoryById(request.parentCategoryId());
         parentCategory.addSubCategory(category);
      }

     return repository.save(category).getId().toString();
    }


    // get all category
    public List<CategoryResponse> getAllCategory() {
        return  repository.findAll().stream()
                .map(mapper::toCategoryDTO)
                .toList();
    }

    // get category by name
    public Optional<Category> getCategoryByName(String name) {
        return repository.findByName(name);
    }

    // find category by Id
    public Category findCategoryById(String id){
        return repository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException("Category with id: " +id+ " not found"));
    }

    //get main categories.
    public List<CategoryResponse> getMainCategories() {
     return  repository.findAll().stream()
                .filter(category -> category.getParentCategory() == null)
                .map(mapper::toCategoryDTO)
                .toList();
    }

    // upload cover picture
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void uploadCoverPicture(String categoryId, MultipartFile file) {
        Category category = this.findCategoryById(categoryId);
        //if there was an old picture of it delete it
        fileStorageService.deleteImage(category.getImageUrl());

        String imageUrl = fileStorageService.saveFile(file, categoryId, "category");
        category.setImageUrl(imageUrl);
        repository.save(category);
    }

    //delete category
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteCategory(String categoryId) {
        Category category =  this.findCategoryById(categoryId);
        String imageUrl = category.getImageUrl();
        //delete image
        fileStorageService.deleteImage(imageUrl);
        repository.delete(category);

    }
}

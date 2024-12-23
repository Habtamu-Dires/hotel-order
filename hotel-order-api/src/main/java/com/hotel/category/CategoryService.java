package com.hotel.category;

import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
import com.hotel.file.FileStorageService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    @Value("${application.server.name}")
    private  String SERVER_NAME;


    private final CategoryRepository repository;
    private final CategoryMapper mapper;
    private final FileStorageService fileStorageService;

    // save category
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public IdResponse saveCategory(@Valid  CategoryRequest request) {
    Category category = Category.builder()
            .name(request.name())
            .description(request.description())
            .imageUrl(request.imageUrl())
            .popularityIndex(request.popularityIndex() == null ?
                    0 : request.popularityIndex())
            .build();

      if(request.id() != null && !request.id().isBlank()) {
          category.setId(UUID.fromString(request.id()));
      } else{
          repository.findByName(request.name())
                  .ifPresent(c -> {
                      throw new EntityExistsException(String.format("Category with name %s already exists", request.name()));
                  });
          category.setId(UUID.randomUUID());
      }

      if(request.parentCategoryId() != null && !request.parentCategoryId().isBlank()){
         Category parentCategory = this.findCategoryById(request.parentCategoryId());
         parentCategory.addSubCategory(category);
      }

     String id = repository.save(category).getId().toString();
     return  new IdResponse(id);
    }


    // get all category
    public List<CategoryResponse> getAllCategory() {
        System.out.printf("###################--%s--#################################################",
                SERVER_NAME);
        return  repository.findAll().stream()
                .map(mapper::toCategoryResponse)
                .toList();
    }

    // get pages of category
    public PageResponse<CategoryResponse> getPagesOfCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> res = repository.findAll(pageable);

        List<CategoryResponse> categoryResponseList = res
                .map(mapper::toCategoryResponse).toList();


        return PageResponse.<CategoryResponse>builder()
                .content(categoryResponseList)
                .totalElements(res.getTotalElements())
                .numberOfElements(res.getNumberOfElements())
                .totalPages(res.getTotalPages())
                .size(res.getSize())
                .number(res.getNumber())
                .first(res.isFirst())
                .last(res.isLast())
                .empty(res.isEmpty())
                .build();
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

    //get main categories at one item available.
    public List<CategoryResponse> getMainCategories() {
        Page<Category> res = repository.findMainCategory(Pageable.unpaged());

     return  res
             .stream()
             .filter(category ->
                     !category.getItems().isEmpty() ||
                     !category.getSubCategories().isEmpty()
             )
             .sorted(Comparator.comparingInt(Category::getPopularityIndex).reversed())
             .map(mapper::toCategoryResponse)
             .toList();
    }

    // get pages of main category
    public PageResponse<CategoryResponse> getPagesOfMainCategory(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> res = repository.findMainCategory(pageable);

        List<CategoryResponse> categoryResponseList = res
                .map(mapper::toCategoryResponse).toList();


        return PageResponse.<CategoryResponse>builder()
                .content(categoryResponseList)
                .totalElements(res.getTotalElements())
                .numberOfElements(res.getNumberOfElements())
                .totalPages(res.getTotalPages())
                .size(res.getSize())
                .number(res.getNumber())
                .first(res.isFirst())
                .last(res.isLast())
                .empty(res.isEmpty())
                .build();
    }

    // get pages of sub categories
    public PageResponse<CategoryResponse> getPagesOfSubCategory(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> res = repository.findSubCategory(pageable);

        List<CategoryResponse> categoryResponseList = res
                .map(mapper::toCategoryResponse).toList();


        return PageResponse.<CategoryResponse>builder()
                .content(categoryResponseList)
                .totalElements(res.getTotalElements())
                .numberOfElements(res.getNumberOfElements())
                .totalPages(res.getTotalPages())
                .size(res.getSize())
                .number(res.getNumber())
                .first(res.isFirst())
                .last(res.isLast())
                .empty(res.isEmpty())
                .build();

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
    // get category by id
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public CategoryResponse getCategoryId(String categoryId) {
        return mapper.toCategoryResponse(this.findCategoryById(categoryId));
    }

    // searching
    public List<CategoryResponse> searchCategoryByName(String name, String filter ){
        Specification<Category> searchSpec = CategorySpecification
                .searchCategory(name,filter);

        return repository.findAll(searchSpec)
                .stream()
                .map(mapper::toCategoryResponse)
                .toList();
    }
}


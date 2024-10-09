package com.hotel.category;

import com.hotel.exception.ResourceAlreadyTakenException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.item.Item;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper mapper;

    // get all category
    public List<CategoryDTO> getAllCategory() {
        return  categoryRepository.findAll().stream()
                .map(mapper::toCategoryDTO)
                .toList();
    }

    // create category
    public void createCategory(CategoryDTO categoryDTO) {
      getCategoryByName(categoryDTO.name()).ifPresent(
             category -> {throw new ResourceAlreadyTakenException(String.format(
                     "Category with name %s already taken",categoryDTO.name())
             );
             }
        );
      Category parentCategory = null;
      if(categoryDTO.parentCategoryId() != null){
         parentCategory = categoryRepository.findById(UUID.fromString(categoryDTO.parentCategoryId()))
                  .orElseThrow(()-> new ResourceNotFoundException(String.format(
                      "Parent Category with id %s is not found",categoryDTO.parentCategoryId()
                  )));
      }

      categoryRepository.save(
            Category.builder()
                    .id(UUID.randomUUID())
                    .name(categoryDTO.name())
                    .imageUrl(categoryDTO.imageUrl())
                    .parentCategory(parentCategory)
                    .build()
       );
    }

    // get category by name
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    public Optional<Category> findCategoryById(UUID id){
        return categoryRepository.findById(id);
    }

    // add sub categories
    @Transactional
    public void addSubCategory(SubCategoryDTO request) {
       Category parentCategory = categoryRepository
            .findById(UUID.fromString(request.parentCategoryId()))
            .orElseThrow(() -> new ResourceNotFoundException(String.format(
                "Category with id %s not found",request.parentCategoryId())
            ));

       List<Category> subCategories = new ArrayList<>();

       request.subCategoryIds().forEach(categoryId -> {
           Category category = categoryRepository
               .findById(UUID.fromString(categoryId))
               .orElseThrow(() -> new ResourceNotFoundException(String.format(
                       "Category with id %s not found", categoryId)
               ));
           subCategories.add(category);
       });

       parentCategory.setSubCategories(subCategories);
       categoryRepository.save(parentCategory);

       subCategories.forEach(category -> {
           category.setParentCategory(parentCategory);
           categoryRepository.save(category);
       });
    }

    //get main categories.
    public List<CategoryDTO> getMainCategories() {
     return  categoryRepository.findAll().stream()
                .filter(category -> category.getParentCategory() == null)
                .map(mapper::toCategoryDTO)
                .toList();
    }

    // save category
    public void saveCategory(Category category){
        categoryRepository.save(category);
    }
}

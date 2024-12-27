package com.hotel.scheduled_tasks;

import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequency;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequencyRepository;
import com.hotel.category.Category;
import com.hotel.category.CategoryRepository;
import com.hotel.item.Item;
import com.hotel.item.ItemRepository;
import com.hotel.role.RoleType;
import com.hotel.user.User;
import com.hotel.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UpdateTasks {

    private final CategoryRepository categoryRepository;
    private final OrderedItemsFrequencyRepository itemsFrequencyRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    @Value("${application.server.name}")
    private  String SERVER_NAME;

    // update popular items
    @Scheduled(cron = "0 0 7 * * *")   // every day at 7 AM
    @Transactional
    public void updatePopularItems(){
        String taskName = "updatePopularItem";
        if(SERVER_NAME.equalsIgnoreCase("ho-api-one")){
            Category popularCategory = categoryRepository.findByName("Popular")
                    .orElse(null);
            if(popularCategory == null){
                // get admin user
                Page<User> pageOfUser = userRepository.findUsersByRole(RoleType.ADMIN, PageRequest.of(0,1));
                User adminUser = pageOfUser.getContent().getFirst();

                Category.builder().build();
                // create a popular category
                popularCategory = categoryRepository.save(
                        Category.builder()
                                .id(UUID.randomUUID())
                                .parentCategory(null)
                                .name("Popular")
                                .items(List.of())
                                .createdBy(adminUser.getUsername())
                                .description("Popular Items Category")
                                .popularityIndex(Integer.MAX_VALUE)
                                .imageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNloMu9E1_ae38NCChLOP1FLrR01XKP27mQA&s")
                                .build()
                );
            }
            // empty the popular category
            List<Item> items = itemRepository.findItemByCategoryId(popularCategory.getId());
            if(!items.isEmpty()){
                for(Item item : items){
                    item.removeCategory(popularCategory);
                    popularCategory.removeItem(item);
                    itemRepository.save(item);
                }
                popularCategory.getItems().clear();
                popularCategory = categoryRepository.saveAndFlush(popularCategory);
            }

            //get items frequency
            List<Item> itemList = itemsFrequencyRepository.findAll()
                    .stream()
                    .sorted(Comparator.comparingInt(
                            OrderedItemsFrequency::getFrequency).reversed()
                    )
                    .limit(12)
                    .map(OrderedItemsFrequency::getItem)
                    .toList();

            for(Item item : itemList){
                item.removeCategory(popularCategory);
                item.addCategory(popularCategory);
                popularCategory.addItem(item);
                itemRepository.save(item);
            }
            categoryRepository.save(popularCategory);
            log.info("successfully performed popular items");
        } else {
            log.info("Update Popular items already performed");
        }

    }
}

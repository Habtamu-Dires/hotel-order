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
import com.hotel.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateTasks {

    private final CategoryRepository categoryRepository;
    private final OrderedItemsFrequencyRepository itemsFrequencyRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    // update popular items  @Scheduled(cron = "0 */1 * * * *")//
    @Scheduled(cron = "0 0 7 * * ?")   // every day at 7 AM
    public void updatePopularItems(){
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
                        .name("Popular")
                        .createdBy(adminUser.getUsername())
                        .description("Popular Items Category")
                        .popularityIndex(Integer.MAX_VALUE)
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
            item.addCategory(popularCategory);
            popularCategory.addItem(item);
            itemRepository.save(item);
        }
         categoryRepository.save(popularCategory);
    }
}

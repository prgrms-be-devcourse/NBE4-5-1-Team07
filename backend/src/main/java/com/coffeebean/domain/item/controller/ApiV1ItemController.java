package com.coffeebean.domain.item.controller;

import com.coffeebean.domain.item.dto.ItemDto;
import com.coffeebean.domain.item.dto.ItemListResponseDto;
import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import com.coffeebean.domain.question.question.dto.QuestionDto;
import com.coffeebean.domain.question.question.service.QuestionService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.security.annotations.AdminOnly;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.parameters.P;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/items")
public class ApiV1ItemController {

    private final ItemService itemService;
    private final QuestionService questionService;


    // 상품 등록 요청을 위한 요청 바디
    record AddReqBody(
        @NotBlank(message = "상품명을 입력하세요")
        String name,
        @NotNull(message = "가격을 입력하세요")
        @Min(value = 1, message = "가격은 1 이상이어야 합니다.")
        int price,
        int stockQuantity,
        String description
    ) {
    }

    // 상품 등록 (파일 업로드 처리)
    @AdminOnly
    @PostMapping
    public RsData<Item> addItem(@RequestParam("name") String name,
        @RequestParam("price") int price,
        @RequestParam("stockQuantity") int stockQuantity,
        @RequestParam("description") String description,
        @RequestParam("image") MultipartFile image) throws IOException {

        String fileName = null;

        // 파일 처리 로직 (파일 저장 등)
        if (!image.isEmpty()) {
            // 파일 저장 경로 설정 (resources/static 폴더 내부)
            String uploadDir = "src/main/resources/static/";
            File uploadDirFile = new File(uploadDir);

            // 폴더가 없으면 생성
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }

            // 파일명 생성 (원본 파일명 사용)
            fileName = image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);

            // 파일을 지정된 경로에 저장
            image.transferTo(filePath);
        }


        // 상품 등록 서비스 호출
        Item item = itemService.addItem(name, price, stockQuantity, description, fileName);

        return new RsData<>(
            "200-1",
            "'%s' 상품이 정상적으로 등록되었습니다.".formatted(item.getName()),
            item
        );
    }

    // 상품 전체 조회 - 페이징
    @GetMapping
    public RsData<Page<ItemDto>> getItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ItemDto> items = itemService.getItems(pageable).map(ItemDto::new);

        return new RsData<>(
                "200-1",
                "상품 목록이 조회되었습니다.",
                items
        );
    }

    // 상품 단건 조회
    @GetMapping("/{id}")
    public RsData<ItemDto> getItem(@PathVariable long id) {

        Item item = itemService.getItem(id).orElseThrow(
                () -> new ServiceException("404-1", "존재하지 않는 상품입니다.")
        );

        return new RsData<>(
                "200-1",
                "%s가 조회 되었습니다.".formatted(item.getName()),
                new ItemDto(item)
        );
    }

    // 상품 삭제
    @AdminOnly
    @DeleteMapping("/{id}")
    @Transactional
    public RsData<Void> deleteItem(@PathVariable long id) {
        Item item = itemService.getItem(id).orElseThrow(
                () -> new ServiceException("404-1", "존재하지 않는 상품입니다.")
        );

        itemService.deleteItem(item);

        return new RsData<>(
                "200-1",
                "%d번 상품 삭제가 완료되었습니다.".formatted(id)
        );

    }

    record ModifyReqBody(
            @NotBlank(message = "상품명을 입력하세요")
            String name,
            @NotNull(message = "가격을 입력하세요")
            @Min(value = 1, message = "가격은 1 이상이어야 합니다.")
            int price,
            int stockQuantity,
            String description
    ) {
    }

    // 상품 수정
    @AdminOnly
    @PutMapping("/{id}")
    @Transactional
    public RsData<Void> modifyItem(@PathVariable long id, @RequestBody @Valid ModifyReqBody reqBody) {
        Item item = itemService.getItem(id).orElseThrow(
                () -> new ServiceException("404-1", "존재하지 않는 상품입니다.")
        );

        Item modifyItem = itemService.modifyItem(item, reqBody.name(), reqBody.price(), reqBody.stockQuantity(), reqBody.description());

        return new RsData<>(
                "200-1",
                "'%S' 상품이 수정완료 되었습니다.".formatted(modifyItem.getName())
        );

    }

    // 해당 상품의 질문 목록 조회
    @GetMapping("/{id}/questions")
    public RsData<List<QuestionDto>> getQuestions(@RequestParam Long itemId,
                                                  @PathVariable("id") Long id) {
        try {
            // itemId에 해당하는 질문 목록 조회
            List<QuestionDto> questions = questionService.getQuestionsByItemId(itemId).stream()
                    .map(QuestionDto::new)
                    .toList();
            return new RsData<>("200-1", "질문 목록 조회가 완료되었습니다.", questions);
        } catch (Exception e) {
            return new RsData<>("500-1", "질문 목록을 불러오는 데 실패했습니다.");
        }
    }

    // 재고 수량만 변경
    @PatchMapping("/{id}/stock")
    public RsData<Void> modifyStock(@PathVariable long id, @RequestBody Map<String, Integer> body) {
        Item item = itemService.getItem(id).orElseThrow(
                () -> new ServiceException("404-1", "존재하지 않는 상품입니다.")
        );

        // 변경된 재고값 업데이트
        if (body.containsKey("stockQuantity")) {
            int newStockQuntity = body.get("stockQuantity");
            itemService.updateStockQuantity(item, newStockQuntity);
        } else {
            throw new ServiceException("400-1", "재고가 입력되지 않았습니다.");
        }

        return new RsData<>(
                "200-1",
                "'%s' 상품의 재고가 %d개로 변경되었습니다.".formatted(item.getName(), body.get("stockQuantity"))
        );
    }

}

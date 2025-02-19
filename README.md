# NBE4-5-1-Team07
프로그래머스 백엔드 데브코스 4기 5회차 7팀 500 Found의 1차 팀 프로젝트입니다.

<br/>
<br/>

## 505 Found Team

|                                           문권이                                           |                                          신동우                                           |                                                        최지선                                                        |                                          엄현수                                           |                                                        김경래                                                        
|:---------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------:|
| <img src="https://avatars.githubusercontent.com/u/102517739?v=4" alt="문권이" width="150"> | <img src="https://avatars.githubusercontent.com/u/58596222?v=4" alt="신동우" width="150"> | <img src="https://avatars.githubusercontent.com/u/192316487?v=4" alt="최지선" width="150"> | <img src="https://avatars.githubusercontent.com/u/55376152?v=4" alt="엄현수" width="150"> | <img src="https://avatars.githubusercontent.com/u/15260002?v=4" alt="김경래" width="150"> |
|                                          PM                                         |                                           FE                                           |                                                        FE                                                         |                                           FE                                           |                                                        FE                                                         |
|                          [GitHub](https://github.com/M00NPANG)                          |                         [GitHub](https://github.com/socra167)                          |                                        [GitHub](https://github.com/wesawth3sun)                                        |                         [GitHub](https://github.com/sameom1048)                          |                                                    [GitHub](https://github.com/GODAOS)                                                     |

<br/>
<br/>

# ☕ Project Overview

## 1. 프로젝트 명
### ☕ 작은 로컬 카페 Grids & Circles

<br/>

## 2. 프로젝트 소개
- 고객들이 Coffe Bean package를 온라인 웹 사이트로 주문할 수 있는 서비스입니다.
- Spring을 이용해서 커피 메뉴 데이터를 관리하는 4가지 로직 CRUD를 구현합니다.
- 매일 전날 오후 2시부터 오늘 오후 2시까지의 주문을 모아서 처리합니다.
- 고객들은 주문, 리뷰, 질문, 포인트 정립 등의 기능을 사용할 수 있습니다.
- 관리자는 상품 및 고객 관리 등 쇼핑몰의 전반적인 관리 기능을 수행할 수 있습니다.

<br/>

## 3. 주요 기능
- **회원가입**:
    - 회원가입 시 DB에 유저정보가 등록됩니다.
- **로그인**:
    - 사용자 인증 정보를 통해 로그인합니다.
- **상품 주문**
  - 고객은 상품의 상세 정보를 확인하고, 장바구니 담기/바로 구매를 선택하여 상품 주문을 할 수 있습니다.
- **상품 관리**
  - 관리자는 상품 추가, 수정, 삭제 기능을 사용할 수 있습니다.
- **주문 관리**
  - 관리자는 오전 2시부터 오후 2시까지의 주문을 일괄 배송 처리한다.
  - 고객의 주문을 취소한다.
- **리뷰/질문/답변**
  - 고객은 상품을 구매 후 리뷰를 달 수 있다.
  - 고객은 상품에 대한 질문은 남길 수 있다.
  - 관리자는 질문에 대한 답변을 남길 수 있다.
- **장바구니**
  - 고객은 장바구니를 통해 원하는 물건을 담아 계산할 수 있다.

<br/>

## 4. 작업 및 역할 분담
   |     |                                                                                         |                                                                                                  |
   |-----|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
   | 문권이 | <img src="https://avatars.githubusercontent.com/u/102517739?v=4" alt="문권이" width="100"> | <ul><li>프로젝트 계획 및 관리</li><li>팀 리딩 및 커뮤니케이션</li><li>회원가입/로그인 페이지 개발</li><li>회원 관리 기능 개발</li></ul> |
   | 신동우 | <img src="https://avatars.githubusercontent.com/u/58596222?v=4" alt="신동우" width="100">  | <ul><li>메인 페이지 개발</li><li>상품 주문 페이지 개발</li><li>장바구니 페이지 개발</li></ul>|
   | 최지선 | <img src="https://avatars.githubusercontent.com/u/192316487?v=4" alt="최지선" width="100"> | <ul><li>사용자 페이지 개발</li><li>사용자 기능 개발</li></ul>|
   | 엄현수 | <img src="https://avatars.githubusercontent.com/u/55376152?v=4" alt="엄현수" width="100">  | <ul><li>메인 페이지 개발</li><li>상품 주문 페이지 개발</li><li>장바구니 페이지 개발</li></ul>|
   | 김경래 | <img src="" alt="김경래" width="100">                                                      | <ul><li>관리자 관리 페이지 개발</li><li>관리자 기능 개발 </li></ul> |

<br/>
<br/>


# 🛠️ Tech
##

## 브랜치 전략
**GitHub Flow** 전략 사용
- **Main Branch**
  - 배포 가능한 상태의 코드를 유지합니다.
  - 모든 배포는 이 브랜치에서 이루어집니다.
- **{name} Branch**
  - 팀원 각자의 개발 브랜치입니다.
  - 모든 기능 개발은 이 브랜치에서 이루어집니다.
- 테스트가 완료되면, Pull Request를 생성하여 Review를 요청합니다. 이 때 타겟은 ```main``` 브랜치입니다.
- Review가 완료되고, 피드백이 모두 반영돠면 해당 ```feature```브랜치를 ```main```브랜치로 **Merge**합니다.

  
<br/>
<br/>

## 컨벤션
[🎯 Commit Convention](https://github.com/prgrms-be-devcourse/NBE4-5-1-Team07/wiki/%F0%9F%93%8C-Git-Commit-Message-Convention#6-%EC%97%AC%EB%9F%AC%EA%B0%80%EC%A7%80-%ED%95%AD%EB%AA%A9%EC%9D%B4-%EC%9E%88%EB%8B%A4%EB%A9%B4-%EA%B8%80%EB%A8%B8%EB%A6%AC-%EA%B8%B0%ED%98%B8%EB%A5%BC-%ED%86%B5%ED%95%B4-%EA%B0%80%EB%8F%85%EC%84%B1-%EB%86%92%EC%9D%B4%EA%B8%B0)
<br/>
[📌 Code Convention](https://github.com/prgrms-be-devcourse/NBE4-5-1-Team07/wiki/%F0%9F%93%8C-Code-Convention)

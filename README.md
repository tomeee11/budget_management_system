<h1 align="center">예산 관리 어플리케이션</h1>



##  개요
본 서비스는 사용자들이 개인 재무를 관리하고 지출을 추적하는 데 도움을 주는 애플리케이션입니다. 이 앱은 사용자들이 예산을 설정하고 지출을 모니터링하며 재무 목표를 달성하는 데 도움이 됩니다.


<br>

## Skills
<p align="center">
<img src="https://img.shields.io/badge/Node.js-version 18-339933">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeScript-version 5-3178C6"><br>
<img src="https://img.shields.io/badge/TypeORM-version 0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;
<img src="https://img.shields.io/badge/Redis-version 2.1.0-DC382C">
</p>

<br>

##  목차
1. [ERD](#erd)
2. [REST API](#rest-api)
3. [요구 사항 구현 내용](#요구-사항-구현-내용)


## ERD
<details>
<summary>ERD 펼치기</summary>
<div markdown="1">

<img src="https://github.com/tomeee11/budget_management_system/assets/114478045/7a324673-de71-4575-a3bc-5b7398cb49af"   width="width size%" height="height size%"/>


</div>
</details>



<br>

## REST API

<details>
<summary>유저 API 펼치기</summary>
<div markdown="1">

### 회원가입

  - #### 요청

    - **메서드**: POST
    - **경로**: `/api/auth/register`

  #### 요청 본문

```json
{
  "username": "사용자명",
  "password": "비밀번호",
}
```
#### 응답 본문

```json
{
  message: "회원가입 되었습니다."
}
```
<br>

### 로그인

  - #### 요청

    - **메서드**: POST
    - **경로**: `/api/auth/login`

  #### 요청 본문

```json
{
  "username": "사용자명",
  "password": "비밀번호",
}
```
#### 응답 본문

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm5pY2tuYW1lIjoi7YSx7Iuc64-E7Yaw7J207J20IiwiaWF0IjoxNzAwMTEyMjQ5LCJleHAiOjE3MDAxMTU4NDl9.nycGUwCy9sfWziosloE8IRpDpU5wVo-Ho7BdEYXlDp8"
}
```
### 로그인

  - #### 요청

    - **메서드**: POST
    - **경로**: `/api/auth/login`

  #### 요청 본문

```json
{
  "username": "사용자명",
  "password": "비밀번호",
}
```
#### 응답 본문

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm5pY2tuYW1lIjoi7YSx7Iuc64-E7Yaw7J207J20IiwiaWF0IjoxNzAwMTEyMjQ5LCJleHAiOjE3MDAxMTU4NDl9.nycGUwCy9sfWziosloE8IRpDpU5wVo-Ho7BdEYXlDp8"
}
```
</div>
</details>

<details>
<summary>예산설정 및 설계 API 펼치기</summary>
<div markdown="1">

### 카테고리 조회

  - #### 요청

    - **메서드**: GET
    - **경로**: `/api/categorie`

#### 응답 본문

```json
[
  {
    "title": "transport"
  },
  {
    "title": "food"
  }
]
```
<br>

### 예산 설정

  - #### 요청

    - **메서드**: POST
    - **경로**: `/api/budget`

  #### 요청 본문

```json
{
  "title":"타이틀 명",
  "amount": 금액
}
```
#### 응답 본문

```json
{
  "message": "예산이 설정되었습니다 "
}
```
<br>

### 예산 설정 변경

  - #### 요청

    - **메서드**: PATCH
    - **경로**: `/api/budget/:id`

  #### 요청 본문

```json
{
  "amount": 변경할 금
}
```
#### 응답 본문

```json
{
  "message": "수정이 완료되었습니다."
}
```
<br>

### 예산 설계

  - #### 요청

    - **메서드**: POST
    - **경로**: `/api/budget/auto-distribute

  #### 요청 본문

```json
{
  "amount": 설계 받을 금액
}
```
#### 응답 본문

```json
{
  "food": 받은 금액 %,
  "transport": 받은 금액 %
}
```
</div>
</details>

<details>
<summary>지출기록 펼치기</summary>
<div markdown="1">

### 지출 생성

  - #### 요청

    - **메서드**: POST
    - **경로**: `/api/expense`

  #### 요청 본문

```json
{
  "title": "타이틀 명",
  "amount": 금액,
  "memo": "메모",
  "expense_date": "날짜"
}
```
#### 응답 본문

```json
{
  "message": "지출이 생성되었습니다."
}
```
<br>

## 지출 수정

  - #### 요청

    - **메서드**: PATCH
    - **경로**: `/api/expense/:id`

  #### 요청 본문

```json
{
  "title": "변경 타이틀",
  "amount": 변경 금액,
  "memo": "변경 메모",
  "expense_date": "변경 날짜"
}
```
#### 응답 본문

```json
{
  "message": "생성된 지출이 수정되었습니다."
}
```
<br>

### 지출 삭제

  - #### 요청

    - **메서드**: DELETE
    - **경로**: `/api/expense/:id`


#### 응답 본문

```json
{
  "message": "생성된 지출이 삭제되었습니다."
}
```
<br>

### 지출 상세 조회

  - #### 요청

    - **메서드**: GET
    - **경로**: `/api/expense/:id`


#### 응답 본문

```json
{
  "id": 아이디,
  "expense_date": "날짜",
  "amount": 금액,
  "memo": "메모",
  "isExclud": true,
  "created_at": "날짜",
  "updated_at": "날짜"
}
```
<br>

### 지출 목록 조회

  - #### 요청

    - **메서드**: GET
    - **경로**: `/api/expense/?startDate&endDate&title&minAmount&maxAmount`

  #### 요청 본문

```json
Query
"startDate"
"endDate"
"title"
"minAmount"
"maxAmount"
```
#### 응답 본문

```json
{
  "totalAmount": 합계 금액,
  "categorySummaries": [
    {
      "category": "타이틀 명",
      "amount": 금액
    },
    {
      "category": "타이틀 명",
      "amount": 금액
    }
  ]
}
```
<br>
</div>
</details>
<details>
<summary>지출 컨설팅 펼치기</summary>
<div markdown="1">

### 오늘 지출 추천

  - #### 요청
    - **메서드**: GET
    - **경로**: `/api/expense/consulting/recommendation`

 
#### 응답 본문

```json
{
  "totalAmount": 토탈금액,
  "categoryAmounts": [
    {
      "category": {
        "id": 아이디,
        "title": "타이틀",
        "monthlyBudget": 금액,
        "created_at": "날짜",
        "updated_at": "날짜"
      },
      "amount": 금액
    },
    {
      "category": {
        "id": 아이디,
        "title": "타이틀",
        "monthlyBudget": 금액,
        "created_at": "날짜",
        "updated_at": "날짜"
      },
      "amount": 금액
    }
  ],
  "userMessage": "오늘은 조금만 사용하세요. 지출을 관리하세요!"
}
```
<br>

### 지출 안내

  - #### 요청

    - **메서드**: GET
    - **경로**: `/api/expense/consulting/today`

#### 응답 본문

```json
{
  "totalAmount": 20000,
  "categorySummaries": {
    "transport": {
      "totalAmount": 20000,
      "expenses": [
        {
          "id": 아이디,
          "expense_date": "날짜",
          "amount": 금액,
          "memo": "메모",
          "isExclud": 불리언,
          "created_at": "날짜",
          "updated_at": "날짜",
          "categorie": {
            "id": 아이디,
            "title": "타이틀",
            "monthlyBudget": 금액,
            "created_at": "날짜",
            "updated_at": "날짜"
         }
        }
      ],
      "optimalAmount": 적정 금액,
      "riskPercentage": 위험도
    }
  }
}
```
</div>
</details>



<details>
<summary>지출 통계 펼치기</summary>
<div markdown="1">

### 지출 수정

  - #### 요청

    - **메서드**: PATCH
    - **경로**: `/api/expense/type/statistics?type=(day,month)`

#### DAY의 경우 응답 본문

```json
{
  "요일": "퍼센트%"
}
```
#### MONTH의 경우 응답 본문

```json
{
  "타이틀": "",
  "타이틀": " 지난달 대비 퍼센트%"
}
```
</div>
</details>
<br>

## 요구 사항 구현 내용

### A. 유저

#### 사용자 회원가입(API)

- `계정명` , `패스워드` 입력하여 회원가입

#### 사용자 로그인(API)
- `계정`, `비밀번호` 로 로그인시 `JWT` 가 발급됩니다.
- 이후 모든 API 요청 Header에 `JWT` 유효성을 검증합니다.

### B. 예산설정 및 설계

#### 카테고리

- 카테고리는 `식비` , `교통` 등 일반적인 지출 카테고리를 의미합니다.
#### 카테고리 목록(API)

- 유저가 예산설정에 사용할 수 있도록 모든 카테고리 목록을 반환합니다.

#### 예산 설정(API)

- 해당 기간 별 설정한 `예산` 을 설정합니다. 예산은 `카테고리` 를 필수로 지정합니다.
    - ex) `식비` : 40만원, `교통` : 20만원

#### 예산 설계 (=추천) (API)
- `카테고리` 지정 없이 총액 (ex. 100만원) 을 입력하면, `카테고리` 별 예산을 자동 생성합니다.
- 자동 생성된 예산은, 기존 이용중인 `유저` 들이 설정한 평균 값 입니다.

### C. 지출 기록

#### 지출

- `지출 일시`, `지출 금액`, `카테고리` 와 `메모` 를 입력하여 생성합니다

#### 지출 CRUD (API)

- 지출을 `생성`, `수정`, `읽기(상세)`, `읽기(목록)`, `삭제` , `합계제외` 할 수 있습니다.
- `읽기(목록)` 은 아래 기능을 가지고 있습니다.
    - 필수적으로 `기간` 으로 조회 합니다.
    - 조회된 모든 내용의 `지출 합계` , `카테고리 별 지출 합계` 를 같이 반환합니다.
    - 특정 `카테고리` 만 조회.
    - `최소` , `최대` 금액으로 조회.
- `합계제외` 처리한 지출은 목록에 포함되지만, 모든 `지출 합계`에서 제외됩니다.

### D. 지출 컨설팅

#### 오늘 지출 추천(API)

- 설정한 `월별` 예산을 만족하기 위해 오늘 지출 가능한 금액을 `총액` 과 `카테고리 별 금액` 으로 제공합니다.

#### 오늘 지출 안내(API)
- 오늘 지출한 내용을 `총액` 과 `카테고리 별 금액` 을 알려줍니다.

### E. 지출 통계

#### 지출 통계 (API)

- `지난 달` 대비 `총액`, `카테고리 별` 소비율.

- `지난 요일` 대비 소비율


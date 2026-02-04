# 백준 예제 따옴표 변환기

백준 온라인 저지(BOJ) 문제 페이지에서 예제 입력/출력을 자동으로 따옴표 형식으로 변환해주는 브라우저 확장 프로그램입니다.

## 기능

- 백준 문제 페이지 접속 시 예제 입력/출력 아래에 변환된 결과 자동 표시
- 개행 문자를 `\n`으로 변환하여 한 줄 문자열로 출력
- 클릭 시 클립보드에 자동 복사

### 변환 예시

**원본 예제:**
```
6 4 2
0100
1110
1000
```

**변환 결과:**
```
"6 4 2\n0100\n1110\n1000"
```

## 지원 브라우저

| 브라우저 | 폴더 |
|---------|------|
| Chrome | `baekjoon-quote-converter/` |
| Safari | `baekjoon-quote-converter-safari/` |

## 설치 방법

### Chrome

1. `chrome://extensions` 접속
2. 우측 상단 **개발자 모드** 활성화
3. **압축해제된 확장 프로그램을 로드합니다** 클릭
4. `baekjoon-quote-converter` 폴더 선택

### Safari

1. 터미널에서 Xcode 프로젝트 생성:
   ```bash
   xcrun safari-web-extension-converter /path/to/baekjoon-quote-converter-safari/Resources \
     --app-name "백준 예제 따옴표 변환기" \
     --bundle-identifier com.soomypo.baekjoonplugin
   ```
2. Xcode에서 프로젝트 빌드 (⌘B) 및 실행 (⌘R)
3. Safari → 설정 → 확장 프로그램에서 활성화
4. `www.acmicpc.net` 웹사이트 접근 권한 허용

## 파일 구조

```
baekjoon-example/
├── README.md
├── baekjoon-quote-converter/          # Chrome 확장 프로그램
│   ├── manifest.json
│   ├── content.js
│   ├── styles.css
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
└── baekjoon-quote-converter-safari/   # Safari 확장 프로그램
    └── Resources/
        ├── manifest.json
        ├── content.js
        ├── styles.css
        └── images/
            ├── icon16.png
            ├── icon48.png
            ├── icon128.png
            ├── icon256.png
            └── icon512.png
```

## 사용 방법

1. 확장 프로그램 설치 후 백준 문제 페이지 접속 (예: https://www.acmicpc.net/problem/16933)
2. 예제 입력/출력 아래에 파란색 테두리의 변환 결과 박스가 자동으로 표시됨
3. 변환 결과 박스 클릭 시 클립보드에 복사
4. 복사 완료 시 초록색으로 변경되며 "복사됨!" 표시

## 라이선스

MIT License

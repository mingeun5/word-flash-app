# Word Flash

Google Sheets에 정리한 영어 단어를 빠르게 반복 학습하는 정적 웹 앱입니다. 브라우저에서 `index.html`만 열어 사용할 수 있고, 단어 데이터는 Google Apps Script Web App을 통해 가져옵니다.

## 주요 기능

- 학습자별 단어 목록 불러오기
- 전체 학습 모드와 리마인드 모드 전환
- 자동 재생 간격 설정
- 랜덤 순서 학습
- 영어만 보기 또는 영어와 뜻 함께 보기
- 예문 표시 켜기/끄기
- 영어만 보기 상태에서 `Meaning` 버튼으로 뜻 확인
- 네이버 영어사전 새 창 열기
- 암기 완료, 암기 완료 취소, 완전 제외 처리
- 다크모드

## Google Sheets 구조

시트의 첫 번째 행은 헤더로 사용하고, 실제 단어는 2행부터 입력합니다.

| 열 | 내용 |
| --- | --- |
| A | 영어 단어 |
| B | 뜻 |
| C | 예문 |
| D | 완료 여부 |

완료 여부 값은 다음처럼 사용합니다.

- 빈 값: 전체 학습 대상
- `Y`: 리마인드 대상
- `X`: 완전 제외

## 실행 방법

별도 빌드 과정은 없습니다. 저장소를 받은 뒤 `index.html`을 브라우저에서 열면 됩니다.

```powershell
Start-Process .\index.html
```

로컬 HTTP 서버로 확인하려면 다음 명령을 사용할 수 있습니다.

```powershell
python -m http.server 8000
```

이후 `http://localhost:8000/`에 접속합니다.

## 설정

앱 설정은 현재 기기와 브라우저의 `localStorage`에 저장됩니다. 저장 키는 `wordFlashSettings`입니다.

저장되는 항목은 Apps Script URL, 학습자, 표시 방식, 자동 재생 간격, 랜덤 여부, 예문 표시 여부, 다크모드 여부입니다. 다른 기기나 다른 브라우저에는 공유되지 않습니다.

## Apps Script

Google Sheets 연동에는 Apps Script Web App이 필요합니다. 이 저장소에서는 배포용 Apps Script 파일을 Git에 포함하지 않습니다. 로컬의 `google-apps-script.gs`는 `.gitignore`에 등록되어 있으므로, 실제 배포 코드는 Apps Script 편집기에 별도로 반영해야 합니다.

## 개발 메모

현재 앱은 단일 `index.html` 안에 HTML, CSS, JavaScript가 함께 들어있는 구조입니다. 기능이 커지면 `css/`, `js/` 디렉터리로 분리하는 것을 권장합니다.

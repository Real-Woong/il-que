# Il-Que

> 현실의 할 일을 RPG의 일일 퀘스트처럼 바꾸는 데스크톱 Quest Tracker

Il-Que는 데스크톱 한쪽에 항상 띄워두고 사용하는 RPG 스타일 생산성 위젯 프로젝트다. 과제, 프로젝트, 공부, 일정과 같은 현실의 할 일을 Quest로 만들고, 게임 속 Quest Tracker를 확인하듯 현재 할 일과 진행도를 빠르게 파악하는 경험을 지향한다.

이 프로젝트는 비상업적인 개인 Toy Project이며, 완성된 결과물을 GitHub 및 Instagram 등을 통해 공개하는 방안을 고려하고 있다.

## Project Status

현재 저장소는 컨셉 및 초기 설계 단계다. 애플리케이션 기능은 아직 구현되지 않았으며, 아래에서 설명하는 UX, 테마, 데스크톱 기능과 기술 스택은 별도로 명시하지 않는 한 초기 방향 또는 향후 계획이다.

## Naming

**Il-Que**는 한국어 표현인 **일퀘**에서 따온 이름으로, 다음 두 의미를 함께 담고 있다.

1. 일일 퀘스트(Daily Quest)
2. 일상 퀘스트(Everyday Quest)

게임 속 캐릭터가 오늘의 퀘스트를 수행한다면, Il-Que에서는 사용자가 현실의 퀘스트를 수행한다.

## Concept

Il-Que가 만들고자 하는 것은 일반적인 Todo App이나 Notion 스타일의 생산성 Dashboard가 아니다. 실제 RPG 화면 한쪽에 계속 노출되는 다음과 같은 HUD의 디자인과 사용 경험을 현실의 할 일 관리에 적용하는 것이 핵심이다.

- Quest Tracker
- Quest Helper
- Objective Tracker

앱은 기본적으로 로컬에서 동작하며, Sticky Note처럼 화면 한쪽에 작게 띄워두는 Desktop Overlay 형태를 목표로 한다. 사용자는 앱을 일부러 열어 전체 Dashboard를 탐색하기보다, 현재 추적 중인 Quest와 Objective를 계속 확인할 수 있다.

## Core UX

사용자는 현실의 할 일을 Quest로 생성한다. 각 Quest는 다음 정보를 가질 수 있도록 설계할 예정이다.

- 제목
- 설명 또는 Objective
- 진행도
- 카테고리
- 완료 여부
- 퀘스트 테마 또는 타입

예시는 다음과 같다.

```text
운영체제 프로젝트
└─ 보고서 초안 작성 2/4

동아리 프로젝트
├─ Git Push
├─ PM에게 보고
└─ 진행도 2/4

알고리즘 공부
└─ LeetCode 문제 풀이 1/3
```

위젯은 가능한 한 작고 간결하게 유지한다. 많은 정보를 한 화면에서 관리하는 생산성 Dashboard보다 현재 추적 중인 일을 빠르게 읽는 HUD에 가깝게 설계한다.

## Game Themes

초기 버전에서는 범위를 넓히기보다 아래 세 가지 게임 스타일을 우선 검토한다.

1. MapleStory
2. Lost Ark
3. Genshin Impact

게임의 원본 UI Asset을 그대로 복제하는 것이 목적은 아니다. 각 게임의 Quest Tracker가 가진 디자인 언어와 정보 표현 방식을 Il-Que에 맞게 재해석한다. 따라서 테마 간 차이는 단순한 색상 변경에 그치지 않고, 한 번에 보여주는 정보량과 카테고리 표현, 시선의 흐름 같은 UX에도 반영한다.

### MapleStory Theme

메이플스토리의 현대적인 `QUEST HELPER` 형태에서 영감을 받은 Compact MMORPG HUD를 지향한다.

- 작은 둥근 Dark Gray Panel
- `QUEST HELPER` Header
- Lime 또는 Yellow-Green Accent
- 텍스트 Label/Pill 형태의 Category
- Quest Title, Objective, Progress
- 최소화 및 닫기용 작은 Control

```text
QUEST HELPER

[과제] 운영체제 프로젝트
보고서 초안 작성 2/4
```

메이플스토리 테마에서는 `과제`, `프로젝트`, `개인`, `공부` 등 사용자가 정한 현실의 카테고리를 텍스트로 명확히 구분하는 것이 핵심이다.

### Lost Ark Theme

로스트아크 게임 화면 우측의 Quest Tracker HUD에서 영감을 받는다. 메이플스토리 테마와 달리 텍스트 Category Label을 중심으로 사용하지 않고, Quest Icon과 Quest Type, 제목 색상으로 작업의 성격을 구분한다.

- 반투명 Dark Background
- Quest별 Header와 왼쪽 Quest Number
- Quest Type Icon 및 타입별 컬러 제목
- 오른쪽 Navigation 또는 Compass Icon
- 하단 Objective와 Progress
- Quest 사이의 얇은 Divider

초기에 참고하는 Quest Type과 현실 작업의 기본 Mapping 예시는 다음과 같다.

| Quest Type | 기본 Mapping 예시 |
| --- | --- |
| 메인 퀘스트 | 핵심 프로젝트 / 가장 중요한 목표 |
| 월드 퀘스트 | 장기 프로젝트 |
| 일반 퀘스트 | 일반 TODO |
| 던전 퀘스트 | 집중해서 완료해야 하는 작업 |
| 모험 퀘스트 | 사이드 프로젝트 / 새로운 시도 |
| 호감도 퀘스트 | 연락 / 약속 / 미팅 |
| 돌발 퀘스트 | 긴급 Task |
| 협동 퀘스트 | 팀 프로젝트 / 협업 |
| 경쟁 퀘스트 | 시험 / 공모전 / 해커톤 |

이 Mapping은 고정된 의미가 아니라 초기 Preset이다. 향후에는 게임 테마의 Quest Symbol 정체성을 유지하면서, 사용자가 각 Symbol이 자신의 일상에서 무엇을 뜻하는지 설정할 수 있도록 설계할 계획이다.

예를 들어 `메인 퀘스트`를 `회사 핵심 업무`, `모험 퀘스트`를 `개인 개발`, `협동 퀘스트`를 `학교 팀플`로 바꿔 사용할 수 있다.

### Genshin Impact Theme

원신 테마는 여러 Quest를 빽빽하게 나열하기보다 현재 추적 중인 하나의 Objective에 집중하는 방향으로 설계한다.

- 배경이 없거나 최소화된 가벼운 HUD
- Ivory 또는 White Typography
- Gold Accent
- Diamond 또는 Quest Marker
- 현재 선택한 Quest와 Objective 중심의 구성
- 적은 정보량과 상대적으로 넓은 여백

## Design Principles

Il-Que는 생산성 앱보다 실제 게임 HUD처럼 보이고 작동하는 것을 중요하게 생각한다.

지향하는 방향:

- MMORPG HUD
- Compact하고 빠르게 읽을 수 있는 정보 구조
- Always-visible Desktop Overlay
- 높은 정보 밀도와 명확한 시각적 우선순위
- 게임마다 구별되는 디자인 Identity

피하고자 하는 방향:

- Notion Widget
- SaaS Dashboard
- 일반적인 Todo Card
- Glassmorphism 중심 디자인
- 모바일 앱 카드 UI

## Desktop Architecture

최종적으로 Windows와 macOS에서 모두 동작하는 Desktop App을 목표로 하며, 현재 고려하는 기술 스택은 다음과 같다.

- Tauri
- React
- TypeScript

UI는 React 기반으로 구현하고 Tauri를 통해 Desktop Window로 제공하는 방안을 검토한다. 계획 중인 주요 Desktop 기능은 다음과 같다.

- Always On Top
- Frameless Window
- Transparent Background
- Draggable Widget
- Local-only Data
- Window Position 저장
- 최소화 및 접기

초기 데이터 저장은 Local Storage 또는 간단한 Local Store로 시작하고, 필요성이 확인되면 SQLite 도입을 검토한다.

## Interaction Modes

다음 두 가지 상호작용 모드는 향후 아이디어이며 아직 구현되지 않았다.

### Edit Mode

- Quest 수정
- Widget 이동
- 완료 상태 변경

### HUD Mode

- Widget을 다른 화면 위에 계속 표시
- 필요할 경우 마우스 입력을 통과시키는 Click-through 동작
- 실제 게임 HUD에 가까운 비개입형 사용 경험

## Future Ideas

- Quest Type 의미를 사용자 환경에 맞게 커스터마이징
- 테마별 정보 구조 및 전환 경험 구체화
- Click-through HUD Mode의 플랫폼별 지원 방식 검토
- Local Store에서 SQLite로 확장할 필요성 검증
- Windows 및 macOS의 창 동작 차이 검증
- GitHub 및 Instagram을 통한 프로젝트 결과물 공개

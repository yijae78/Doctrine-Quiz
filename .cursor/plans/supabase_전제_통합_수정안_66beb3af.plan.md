---
name: Supabase 전제 통합 수정안
overview: Supabase 연동을 전제로, 반 배정 확인/보내기·로그인 명단 연동·상점 수정 권한·최초 로그인 5달란트·챌린지 방(부여 달란트 표시·관리자 수정·배팅형) 등 지금까지 논의한 모든 내용을 [index.tsx](index.tsx) 기준으로 단계별로 반영하는 수정안입니다.
todos: []
isProject: false
---

# Supabase 전제 통합 수정안 (단계별)

대상 파일: [index.tsx](index.tsx). Supabase 연동 시 데이터 접근 함수·타입만 교체하면 되도록 유지합니다.

---

## Phase 1: 데이터·타입 (Supabase 대비)

- **Challenge 타입 추가:** `id`, `title`, `description`, `talents`(숫자), `type`: `'normal' | 'bet'`. 추후 Supabase 테이블 컬럼과 맞출 수 있도록 snake_case 필드명은 매핑 단계에서 처리.
- **챌린지 목록:** `challenges` state, 초기값은 상수 배열 `DEFAULT_CHALLENGES`(게임·성경 읽기·선생님께 카톡 보내기 등 예시 3~5개). localStorage `dream_challenges` 로드/저장. Supabase 연동 시 `fetchChallenges()` 로 교체.
- **완료 기록:** `completedChallenges: string[]` (챌린지 id), localStorage `dream_completed_challenges`. 배팅 진행 중인 챌린지용 `pendingBetChallengeId`, `pendingBetAmount` 등 필요 시 state 추가.
- **첫 로그인 보너스:** localStorage `dream_first_login_done` 사용 (이미 논의된 대로).

---

## Phase 2: 최초 로그인 5 달란트

- **위치:** [index.tsx](index.tsx) `handleSaveName` (약 504~518줄).
- **로직:** 이름 저장 직후 `localStorage.getItem('dream_first_login_done')` 확인. 없으면 `addTalents(5)` 호출, `localStorage.setItem('dream_first_login_done', '1')` 저장, `alert('첫 로그인 선물로 5 달란트가 지급되었어요!')` 또는 짧은 토스트 표시. 있으면 생략.
- 달란트 표시는 기존 `talents` state로 헤더에 이미 반영되므로 추가 UI 없음.

---

## Phase 3: 달란트 상점 관리 - 관리자만 수정

- **위치:** [index.tsx](index.tsx) 달란트 상점 관리 블록 (약 1194~1220줄).
- **변경:** 각 아이템 행의 "수정" 버튼과 "삭제" 버튼을 `isAdmin`일 때만 렌더. `{isAdmin && ( ... 수정/삭제 버튼 ... )}`. 교사는 목록만 조회.

---

## Phase 4: 반 배정 - 확인/보내기 + 로그인한 학생 명단 표시

**4-1. 반 배정 확인/보내기**

- **달란트 선물 명단:** 관리자가 드롭다운으로 반을 바꾸면 즉시 저장하지 않고, 해당 행에 "확인" 또는 "보내기" 버튼 표시. state에 `pendingClassAssign: { studentId: string, classId: string | null } | null` 추가. "보내기" 클릭 시 `assignStudentToClass(pendingClassAssign.studentId, pendingClassAssign.classId)` 호출 후 `setPendingClassAssign(null)`. 드롭다운은 "선택 중인 값"을 pending 반영해 표시.
- **반별 관리 > 학생 반 배정:** 동일하게 반 선택 시 "확인" 버튼 노출, 클릭 시에만 `assignStudentToClass` 호출. (또는 한 번에 여러 명 변경 시 "변경 사항 보내기" 단일 버튼으로 처리 가능. 최소 구현은 행별 "확인".)

**4-2. 로그인한 학생 명단을 추가할 학생 이름 영역에 표시**

- **위치:** 달란트 선물 명단 상단(약 1102~1120줄) "추가할 학생 이름" 입력부 위 또는 옆.
- **추가:** "지금 로그인한 친구들" 블록. `loggedInStudents.length > 0`일 때 `loggedInStudents`를 이름 목록(또는 작은 칩/리스트)으로 표시. 반별 관리 화면 상단에도 동일 블록 추가하면 관리자가 반 편성할 때 참고 가능.

---

## Phase 5: 로그인한 학생 명단에 반·달란트 반영

- **위치:** [index.tsx](index.tsx) 로그인한 학생 명단 테이블 (약 1234~1249줄).
- **변경:** `loggedInStudents`를 순회할 때 `students`에서 `name`으로 매칭(또는 추후 Supabase에서 id 매칭). 매칭된 항목의 `classId`로 `classes`에서 반 이름 조회, `talents` 표시. 테이블에 컬럼 추가: 이름, 로그인 시각, **반**, **달란트**. 매칭 없으면 반/달란트는 "-" 또는 "미등록".

---

## Phase 6: 챌린지 방 카드 및 화면

**6-1. 메인 그리드에 챌린지 방 카드**

- **위치:** [index.tsx](index.tsx) 첫 페이지 그리드. `THEOLOGY_TOPICS.map(...)` 다음, "교사 전용실" 버튼 앞(약 1049~1055줄 사이).
- **추가:** "챌린지 방" 카드 1개. 클릭 시 `setSelectedChallengeRoom(true)` 및 `setSelectedTopic(null)` 같은 분기로 챌린지 전용 뷰 진입. 아이콘은 Trophy 또는 Zap, 색상은 구분 가능하게(예: amber 또는 orange).

**6-2. 챌린지 방 전용 뷰**

- **분기:** `!selectedTopic && activeTab !== 'teacher'` 인 경우, `selectedChallengeRoom === true`이면 챌린지 방 콘텐츠 렌더. 뒤로가기 시 `setSelectedChallengeRoom(false)`.
- **레이아웃:** 상단 "챌린지 방" 제목 + 뒤로가기. 아래 `challenges` 목록을 카드/리스트로 표시.
- **각 챌린지 카드:** 제목, 설명, **부여 달란트 표시** ("완료 시 N 달란트" 또는 배팅형이면 "걸기 (완료 시 2배)"). 관리자일 때만 "부여 달란트 수정" 버튼 또는 인라인 입력(숫자) 노출, 저장 시 해당 챌린지의 `talents`만 갱신하고 localStorage/state 반영.
- **타입별 UI:**
  - **normal:** "완료했어요" 버튼. 클릭 시 `completedChallenges`에 id 없으면 `addTalents(challenge.talents)` 및 completed에 id 추가, 저장.
  - **bet:** "N 달란트 걸기 (완료 시 2배)" 문구 + 숫자 입력(1 ~ min(보유 달란트, 챌린지 최대)). "도전하기" 클릭 시 걸 금액 차감, 진행 중 상태 저장. "완료했어요" 클릭 시 2배 지급, 진행 중 해제.
- **예시 챌린지:** 게임(예: 3달란트), 성경 읽기(5달란트), 선생님께 카톡 보내기(5달란트, 안내 문구 + 링크), 배팅형 1개(최대 10달란트 걸기 등).

---

## Phase 7: Supabase 연동 시 교체 포인트 (참고)

- `fetchLoggedInStudents`, `fetchMaterials` 이미 함수로 분리됨.
- `challenges`: `fetchChallenges()` 도입 시 state 초기값·저장을 해당 함수로 교체.
- `completedChallenges`: Supabase 테이블(사용자별 완료 기록)과 동기화.
- 반·학생·첫 로그인 보너스: 필요 시 각각 Supabase 테이블/플래그로 이전.

---

## 구현 순서 요약


| 단계  | 내용                                                                                            |
| --- | --------------------------------------------------------------------------------------------- |
| 1   | Challenge 타입·challenges state·completedChallenges state·DEFAULT_CHALLENGES 상수·localStorage 저장 |
| 2   | handleSaveName에 첫 로그인 5 달란트 + dream_first_login_done                                          |
| 3   | 달란트 상점 관리에서 수정/삭제 버튼을 isAdmin일 때만 표시                                                          |
| 4   | 반 배정: pendingClassAssign + 행별 "확인"/"보내기" 버튼; 달란트 선물 명단·반별 관리 상단에 로그인한 학생 명단 블록                |
| 5   | 로그인한 학생 명단 테이블에 반·달란트 컬럼 (students와 name 매칭)                                                  |
| 6   | 메인 그리드에 챌린지 방 카드; selectedChallengeRoom 분기 및 챌린지 방 뷰(목록·부여 달란트 표시·관리자 수정·normal/bet 처리)       |


위 순서대로 적용하면 논의하신 기능이 모두 반영되고, 추후 Supabase만 붙이면 됩니다.
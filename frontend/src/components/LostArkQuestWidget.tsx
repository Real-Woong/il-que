import {
  forwardRef,
  type MouseEvent as ReactMouseEvent,
} from "react"

import type {
  ProgressType,
  Quest,
} from "../App"
import "./LostArkQuestWidget.css"

type QuestKind =
  | "main"
  | "adventure"
  | "urgent"
  | "cooperation"
  | "rapport"
  | "normal"

type QuestFormState = {
  category: string
  title: string
  objective: string
  progressType: ProgressType
  progress: number
  total: number
}

type LostArkQuestWidgetProps = {
  quests: Quest[]
  selectedQuestId: string | null
  editingProgressId: string | null
  isAdding: boolean
  form: QuestFormState
  onMouseDown: (
    event: ReactMouseEvent<HTMLElement>,
  ) => void
  onToggleQuestActions: (id: string) => void
  onCompleteQuest: (id: string) => void
  onDeleteQuest: (id: string) => void
  onToggleProgressEditor: (id: string) => void
  onChangeProgress: (id: string, amount: number) => void
  onToggleAdd: () => void
  onMinimize: () => void
  onClose: () => void
  onCategoryChange: (value: string) => void
  onTitleChange: (value: string) => void
  onObjectiveChange: (value: string) => void
  onProgressTypeChange: (value: ProgressType) => void
  onProgressChange: (value: number) => void
  onTotalChange: (value: number) => void
  onCancelAdd: () => void
  onAddQuest: () => void
}

function getQuestKind(category: string): QuestKind {
  const normalized = category.toLowerCase()

  if (/프로젝트|모험|사이드|adventure|project/.test(normalized)) {
    return "adventure"
  }

  if (/긴급|돌발|urgent/.test(normalized)) {
    return "urgent"
  }

  if (/협동|협업|팀|cooperation|team/.test(normalized)) {
    return "cooperation"
  }

  if (/연락|약속|미팅|호감|rapport|meeting/.test(normalized)) {
    return "rapport"
  }

  if (/학교|과제|공부|시험|메인|school|main|study/.test(normalized)) {
    return "main"
  }

  return "normal"
}

function QuestTypeIcon({ kind }: { kind: QuestKind }) {
  if (kind === "adventure") {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M14 2.8 25.2 14 14 25.2 2.8 14 14 2.8Z" />
        <path d="m14 7.1 2 4.9 4.9 2-4.9 2-2 4.9-2-4.9-4.9-2 4.9-2 2-4.9Z" />
      </svg>
    )
  }

  if (kind === "urgent") {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M14 2.5 25.5 14 14 25.5 2.5 14 14 2.5Z" />
        <path d="M14 7.5v8.2M14 19.6v.9" />
      </svg>
    )
  }

  if (kind === "cooperation") {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M14 2.8 25.2 14 14 25.2 2.8 14 14 2.8Z" />
        <path d="m9.2 16.9 4.8-7.8 4.8 7.8M11 14.2h6" />
      </svg>
    )
  }

  if (kind === "rapport") {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M14 2.8 25.2 14 14 25.2 2.8 14 14 2.8Z" />
        <path d="M14 19.6s-5-2.9-5-6.4c0-2.7 3.5-3.5 5-1.2 1.5-2.3 5-1.5 5 1.2 0 3.5-5 6.4-5 6.4Z" />
      </svg>
    )
  }

  if (kind === "main") {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M14 2.5 25.5 14 14 25.5 2.5 14 14 2.5Z" />
        <path d="m14 7.4 1.7 4.6 4.6 1.7-4.6 1.7-1.7 4.7-1.7-4.7-4.6-1.7 4.6-1.7L14 7.4Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M14 2.8 25.2 14 14 25.2 2.8 14 14 2.8Z" />
      <circle cx="14" cy="14" r="4.2" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 21 21" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="7.4" />
      <path d="m13.8 7.2-2 4.6-4.6 2 2-4.6 4.6-2Z" />
      <circle cx="10.5" cy="10.5" r="1" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 8 10" aria-hidden="true">
      <path d="m2.2 1.4 3.6 3.6-3.6 3.6" />
    </svg>
  )
}

function getObjectiveDetail(quest: Quest) {
  if (quest.completed) return "목표를 완료했습니다"

  return quest.progressType === "count"
    ? "목표 수량을 달성하세요"
    : "목표를 완료하세요"
}

const LostArkQuestWidget = forwardRef<
  HTMLElement,
  LostArkQuestWidgetProps
>(function LostArkQuestWidget(
  {
    quests,
    selectedQuestId,
    editingProgressId,
    isAdding,
    form,
    onMouseDown,
    onToggleQuestActions,
    onCompleteQuest,
    onDeleteQuest,
    onToggleProgressEditor,
    onChangeProgress,
    onToggleAdd,
    onMinimize,
    onClose,
    onCategoryChange,
    onTitleChange,
    onObjectiveChange,
    onProgressTypeChange,
    onProgressChange,
    onTotalChange,
    onCancelAdd,
    onAddQuest,
  },
  ref,
) {
  return (
    <section
      ref={ref}
      className="lostark-widget"
      onMouseDown={onMouseDown}
      aria-label="Lost Ark quest tracker"
    >
      <div className="lostark-quest-stack">
        {quests.map((quest, index) => {
          const kind = getQuestKind(quest.category)
          const actionsOpen = selectedQuestId === quest.id
          const progressOpen = editingProgressId === quest.id

          return (
            <article
              key={quest.id}
              className={`lostark-quest-block lostark-kind-${kind}${
                quest.completed ? " is-completed" : ""
              }`}
            >
              <header className="lostark-quest-header">
                <button
                  type="button"
                  className="lostark-header-left lostark-quest-click-target"
                  onClick={() => onToggleQuestActions(quest.id)}
                  aria-expanded={actionsOpen}
                  aria-label={`${quest.title} 퀘스트 동작 열기`}
                >
                  <span className="lostark-quest-number">
                    {index + 1}
                  </span>
                  <span className="lostark-type-icon">
                    <QuestTypeIcon kind={kind} />
                  </span>
                  <span className="lostark-quest-title">
                    {quest.title}
                  </span>
                </button>

                <div className="lostark-header-right">
                  {index === 0 && (
                    <div className="lostark-window-controls">
                      <button
                        type="button"
                        onClick={onToggleAdd}
                        aria-label="퀘스트 추가"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={onMinimize}
                        aria-label="최소화"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    className="lostark-compass"
                    onClick={() => onToggleQuestActions(quest.id)}
                    aria-label={`${quest.title} 퀘스트 메뉴`}
                  >
                    <CompassIcon />
                  </button>
                </div>
              </header>

              <div
                className="lostark-entry lostark-quest-click-target"
                onClick={() => onToggleQuestActions(quest.id)}
              >
                <div className="lostark-objective-row">
                  <span className="lostark-objective-headline">
                    {quest.objective}
                  </span>
                  <span className="lostark-chevron">
                    <ChevronIcon />
                  </span>
                </div>

                <div className="lostark-objective-detail-row">
                  <span className="lostark-objective-detail">
                    {getObjectiveDetail(quest)}
                  </span>

                  {quest.completed ? (
                    <span className="lostark-completed-indicator">
                      완료
                    </span>
                  ) : quest.progressType === "single" ? (
                    <span className="lostark-single-status">
                      즉시완료 가능
                    </span>
                  ) : (
                    <div
                      className="lostark-progress-control progress-control"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {progressOpen && (
                        <button
                          type="button"
                          className="lostark-progress-button"
                          onClick={() => onChangeProgress(quest.id, -1)}
                          aria-label="진행도 감소"
                        >
                          −
                        </button>
                      )}

                      <button
                        type="button"
                        className="lostark-progress"
                        onClick={() => onToggleProgressEditor(quest.id)}
                        aria-label={`진행도 ${quest.progress ?? 0}/${quest.total ?? 1}, 편집`}
                        aria-expanded={progressOpen}
                      >
                        <strong>{quest.progress ?? 0}</strong>
                        <span>/{quest.total ?? 1}</span>
                      </button>

                      {progressOpen && (
                        <button
                          type="button"
                          className="lostark-progress-button"
                          onClick={() => onChangeProgress(quest.id, 1)}
                          aria-label="진행도 증가"
                        >
                          +
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {actionsOpen && (
                  <div
                    className="lostark-actions quest-actions"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {quest.completed ? (
                      <button
                        type="button"
                        className="lostark-delete-action"
                        onClick={() => onDeleteQuest(quest.id)}
                      >
                        완료 · 목록에서 지우기
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="lostark-complete-action"
                          onClick={() => onCompleteQuest(quest.id)}
                        >
                          완료
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleQuestActions(quest.id)}
                        >
                          취소
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {quests.length === 0 && !isAdding && (
        <div className="lostark-empty">
          <span>추적 중인 퀘스트가 없습니다</span>
          <button type="button" onClick={onToggleAdd}>
            퀘스트 추가
          </button>
        </div>
      )}

      {isAdding && (
        <div className="lostark-form">
          <input
            value={form.category}
            onChange={(event) => onCategoryChange(event.target.value)}
            placeholder="유형 (학교, 프로젝트, 협동...)"
          />
          <input
            value={form.title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="퀘스트 제목"
            autoFocus
          />
          <input
            value={form.objective}
            onChange={(event) => onObjectiveChange(event.target.value)}
            placeholder="목표"
          />

          <div className="lostark-progress-type">
            <button
              type="button"
              className={form.progressType === "single" ? "active" : ""}
              onClick={() => onProgressTypeChange("single")}
            >
              단발성
            </button>
            <button
              type="button"
              className={form.progressType === "count" ? "active" : ""}
              onClick={() => onProgressTypeChange("count")}
            >
              수량형
            </button>
          </div>

          {form.progressType === "count" && (
            <div className="lostark-progress-inputs">
              <input
                type="number"
                min="0"
                value={form.progress}
                onChange={(event) => onProgressChange(Number(event.target.value))}
              />
              <span>/</span>
              <input
                type="number"
                min="1"
                value={form.total}
                onChange={(event) => onTotalChange(Number(event.target.value))}
              />
            </div>
          )}

          <div className="lostark-form-actions">
            <button type="button" onClick={onCancelAdd}>
              취소
            </button>
            <button type="button" onClick={onAddQuest}>
              추적 시작
            </button>
          </div>
        </div>
      )}
    </section>
  )
})

export default LostArkQuestWidget

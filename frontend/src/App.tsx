import {
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react"

import {
  getCurrentWindow,
  LogicalSize,
} from "@tauri-apps/api/window"

type ProgressType = "count" | "single"

type Quest = {
  id: string
  category: string
  title: string
  objective: string
  progressType: ProgressType
  progress?: number
  total?: number
  completed: boolean
}

function App() {
  /* =======================================================
     Quest Data
  ======================================================= */

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: crypto.randomUUID(),
      category: "과제",
      title: "운영체제 프로젝트",
      objective: "보고서 초안 작성",
      progressType: "count",
      progress: 2,
      total: 4,
      completed: false,
    },
  ])

  /* =======================================================
     UI State
  ======================================================= */

  const [isAdding, setIsAdding] = useState(false)

  const [selectedQuestId, setSelectedQuestId] =
    useState<string | null>(null)

  const [editingProgressId, setEditingProgressId] =
    useState<string | null>(null)

  /* =======================================================
     Add Quest Form
  ======================================================= */

  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [objective, setObjective] = useState("")

  const [progressType, setProgressType] =
    useState<ProgressType>("single")

  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(1)

  /* =======================================================
     HUD Reference
  ======================================================= */

  const hudRef = useRef<HTMLElement>(null)

  /* =======================================================
     Window
  ======================================================= */

  const appWindow = getCurrentWindow()

  /* =======================================================
     Drag Window
  ======================================================= */

  async function handleWindowDrag(
    event: ReactMouseEvent<HTMLElement>,
  ) {
    if (event.button !== 0) return

    const target = event.target as HTMLElement

    /*
     * 아래 요소들은 클릭 동작이 있으므로
     * 창 드래그를 시작하지 않는다.
     */
    if (
      target.closest(
        `
          button,
          input,
          .quest-title,
          .progress-control,
          .quest-actions
        `,
      )
    ) {
      return
    }

    await appWindow.startDragging()
  }

  /* =======================================================
     Quest Form
  ======================================================= */

  function resetForm() {
    setCategory("")
    setTitle("")
    setObjective("")

    setProgressType("single")

    setProgress(0)
    setTotal(1)
  }

  function closeAddForm() {
    resetForm()
    setIsAdding(false)
  }

  function addQuest() {
    if (!title.trim()) return

    const safeTotal = Math.max(1, total)
    const safeProgress = Math.min(
      Math.max(0, progress),
      safeTotal,
    )

    const newQuest: Quest = {
      id: crypto.randomUUID(),

      category: category.trim() || "일반",

      title: title.trim(),

      objective:
        objective.trim() || "목표를 완료하세요",

      progressType,

      completed: false,

      ...(progressType === "count"
        ? {
            progress: safeProgress,
            total: safeTotal,
          }
        : {}),
    }

    setQuests((previous) => [
      ...previous,
      newQuest,
    ])

    resetForm()
    setIsAdding(false)
  }

  /* =======================================================
     Quest Selection
  ======================================================= */

  function toggleQuestActions(id: string) {
    setEditingProgressId(null)

    setSelectedQuestId((current) =>
      current === id ? null : id,
    )
  }

  function cancelQuestActions() {
    setSelectedQuestId(null)
  }

  /* =======================================================
     Complete Quest
  ======================================================= */

  function completeQuest(id: string) {
    setQuests((previous) =>
      previous.map((quest) => {
        if (quest.id !== id) {
          return quest
        }

        return {
          ...quest,

          completed: true,

          ...(quest.progressType === "count"
            ? {
                progress: quest.total ?? 1,
              }
            : {}),
        }
      }),
    )

    setSelectedQuestId(null)
    setEditingProgressId(null)
  }

  /* =======================================================
     Progress Editing
  ======================================================= */

  function toggleProgressEditor(id: string) {
    setSelectedQuestId(null)

    setEditingProgressId((current) =>
      current === id ? null : id,
    )
  }

  function changeProgress(
    id: string,
    amount: number,
  ) {
    setQuests((previous) =>
      previous.map((quest) => {
        if (
          quest.id !== id ||
          quest.progressType !== "count" ||
          quest.completed
        ) {
          return quest
        }

        const current = quest.progress ?? 0
        const maximum = quest.total ?? 1

        const next = Math.max(
          0,
          Math.min(
            maximum,
            current + amount,
          ),
        )

        return {
          ...quest,
          progress: next,
        }
      }),
    )
  }

  /* =======================================================
     Automatic Window Resize
  ======================================================= */

  useLayoutEffect(() => {
    const hud = hudRef.current

    if (!hud) return

    const resize = async () => {
      const hudHeight =
        hud.getBoundingClientRect().height

      await appWindow.setSize(
        new LogicalSize(
          240,
          Math.ceil(hudHeight + 10),
        ),
      )
    }

    const observer = new ResizeObserver(resize)

    observer.observe(hud)

    resize()

    return () => {
      observer.disconnect()
    }
  }, [appWindow])

  // DELTE
  function deleteQuest(id: string) {
    setQuests((previous) =>
      previous.filter((quest) => quest.id !== id),
    )

    setSelectedQuestId(null)
    setEditingProgressId(null)
  }

  /* =======================================================
     Render
  ======================================================= */

  return (
    <main className="app">
      <section
        ref={hudRef}
        className="quest-hud"
        onMouseDown={handleWindowDrag}
      >
        {/* =================================================
            Header
        ================================================= */}

        <header className="quest-header">
          <div className="header-left">
            <span className="helper-title">
              QUEST HELPER
            </span>

            <span className="quest-count">
              {quests.length}
            </span>
          </div>

          <div className="header-right">
            <button
              className="add"
              type="button"
              aria-label="Add quest"
              onClick={() => {
                setSelectedQuestId(null)
                setEditingProgressId(null)

                setIsAdding(
                  (previous) => !previous,
                )
              }}
            >
              +
            </button>

            <button
              className="minimize"
              type="button"
              aria-label="Minimize"
            >
              <span />
            </button>

            <button
              className="close"
              type="button"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </header>

        {/* =================================================
            Quest List
        ================================================= */}

        <div className="quest-list">
          {quests.map((quest) => {
            const actionsOpen =
              selectedQuestId === quest.id

            const progressOpen =
              editingProgressId === quest.id

            return (
              <div
                className={[
                  "quest-body",
                  quest.completed
                    ? "quest-completed"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={quest.id}
              >
                {/* Quest Title */}

                <div className="title-row">
                  <span className="quest-tag">
                    {quest.category}
                  </span>

                  <button
                    type="button"
                    className="quest-title"
                    onClick={() =>
                      toggleQuestActions(
                        quest.id,
                      )
                    }
                  >
                    {quest.title}
                  </button>
                </div>

                {/* Complete / Cancel */}

                {actionsOpen && (
                  <div className="quest-actions">
                    {quest.completed ? (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteQuest(quest.id)}
                      >
                        삭제
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="complete-button"
                          onClick={() => completeQuest(quest.id)}
                        >
                          완료
                        </button>

                        <button
                          type="button"
                          className="cancel-button"
                          onClick={cancelQuestActions}
                        >
                          취소
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Objective */}

                <div className="objective-row">
                  <span className="objective">
                    {quest.objective}
                  </span>

                  {/* Single Quest */}

                  {quest.progressType ===
                    "single" &&
                    quest.completed && (
                      <span className="single-complete">
                        ✓
                      </span>
                    )}

                  {/* Count Quest */}

                  {quest.progressType ===
                    "count" && (
                    <div className="progress-control">
                      {quest.completed ? (
                        <>
                          <span className="complete-check">
                            ✓
                          </span>

                          <span className="progress">
                            <span className="progress-complete">
                              {quest.progress}
                            </span>

                            <span className="progress-total">
                              /{quest.total}
                            </span>
                          </span>
                        </>
                      ) : (
                        <>
                          {progressOpen && (
                            <button
                              type="button"
                              className="progress-button"
                              onClick={() =>
                                changeProgress(
                                  quest.id,
                                  -1,
                                )
                              }
                            >
                              −
                            </button>
                          )}

                          <button
                            type="button"
                            className="progress progress-clickable"
                            onClick={() =>
                              toggleProgressEditor(
                                quest.id,
                              )
                            }
                          >
                            <span className="progress-current">
                              {quest.progress}
                            </span>

                            {!progressOpen && (
                              <span className="progress-total">
                                /{quest.total}
                              </span>
                            )}
                          </button>

                          {progressOpen && (
                            <>
                              <button
                                type="button"
                                className="progress-button"
                                onClick={() =>
                                  changeProgress(
                                    quest.id,
                                    1,
                                  )
                                }
                              >
                                +
                              </button>

                              <span className="progress-total progress-total-expanded">
                                /{quest.total}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* =================================================
            Add Quest Form
        ================================================= */}

        {isAdding && (
          <div className="quest-form">
            <input
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value,
                )
              }
              placeholder="카테고리"
            />

            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="퀘스트 제목"
              autoFocus
            />

            <input
              value={objective}
              onChange={(event) =>
                setObjective(
                  event.target.value,
                )
              }
              placeholder="목표"
            />

            {/* Progress Type */}

            <div className="progress-type">
              <button
                type="button"
                className={
                  progressType === "single"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setProgressType("single")
                }
              >
                단발성
              </button>

              <button
                type="button"
                className={
                  progressType === "count"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setProgressType("count")
                }
              >
                수량형
              </button>
            </div>

            {/* Count Settings */}

            {progressType === "count" && (
              <div className="progress-inputs">
                <input
                  type="number"
                  min="0"
                  value={progress}
                  onChange={(event) =>
                    setProgress(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                />

                <span>/</span>

                <input
                  type="number"
                  min="1"
                  value={total}
                  onChange={(event) =>
                    setTotal(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                />
              </div>
            )}

            {/* Actions */}

            <div className="form-actions">
              <button
                type="button"
                onClick={closeAddForm}
              >
                취소
              </button>

              <button
                type="button"
                onClick={addQuest}
              >
                저장
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
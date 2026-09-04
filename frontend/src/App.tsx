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

import Landing, {
  type Theme,
} from "./Landing"

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
     Window
  ======================================================= */

  const appWindow = getCurrentWindow()

  /* =======================================================
     Theme
  ======================================================= */

  const [selectedTheme, setSelectedTheme] =
    useState<Theme | null>(null)

  /* =======================================================
     Quest Data
  ======================================================= */

  const [quests, setQuests] = useState<
    Quest[]
  >([
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

  const [isAdding, setIsAdding] =
    useState(false)

  const [
    selectedQuestId,
    setSelectedQuestId,
  ] = useState<string | null>(null)

  const [
    editingProgressId,
    setEditingProgressId,
  ] = useState<string | null>(null)

  /* =======================================================
     Add Form
  ======================================================= */

  const [category, setCategory] =
    useState("")

  const [title, setTitle] =
    useState("")

  const [objective, setObjective] =
    useState("")

  const [
    progressType,
    setProgressType,
  ] =
    useState<ProgressType>("single")

  const [progress, setProgress] =
    useState(0)

  const [total, setTotal] =
    useState(1)

  /* =======================================================
     Resize Reference
  ======================================================= */

  const contentRef =
    useRef<HTMLElement>(null)

  /* =======================================================
     Window Drag
  ======================================================= */

  async function handleWindowDrag(
    event: ReactMouseEvent<HTMLElement>,
  ) {
    if (event.button !== 0) return

    const target =
      event.target as HTMLElement

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
     Window Controls
  ======================================================= */

  async function minimizeWindow() {
    await appWindow.minimize()
  }

  async function closeWindow() {
    await appWindow.close()
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

    const safeTotal =
      Math.max(1, total)

    const safeProgress = Math.min(
      Math.max(0, progress),
      safeTotal,
    )

    const newQuest: Quest = {
      id: crypto.randomUUID(),

      category:
        category.trim() || "일반",

      title: title.trim(),

      objective:
        objective.trim() ||
        "목표를 완료하세요",

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
     Quest Actions
  ======================================================= */

  function toggleQuestActions(
    id: string,
  ) {
    setEditingProgressId(null)

    setSelectedQuestId(
      (current) =>
        current === id ? null : id,
    )
  }

  function completeQuest(id: string) {
    setQuests((previous) =>
      previous.map((quest) => {
        if (quest.id !== id)
          return quest

        return {
          ...quest,
          completed: true,

          ...(quest.progressType ===
          "count"
            ? {
                progress:
                  quest.total ?? 1,
              }
            : {}),
        }
      }),
    )

    setSelectedQuestId(null)
    setEditingProgressId(null)
  }

  function deleteQuest(id: string) {
    setQuests((previous) =>
      previous.filter(
        (quest) => quest.id !== id,
      ),
    )

    setSelectedQuestId(null)
    setEditingProgressId(null)
  }

  /* =======================================================
     Progress
  ======================================================= */

  function toggleProgressEditor(
    id: string,
  ) {
    setSelectedQuestId(null)

    setEditingProgressId(
      (current) =>
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
          quest.progressType !==
            "count" ||
          quest.completed
        ) {
          return quest
        }

        const current =
          quest.progress ?? 0

        const maximum =
          quest.total ?? 1

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
    const content =
      contentRef.current

    if (!content) return

    const resize = async () => {
      const height =
        content.getBoundingClientRect()
          .height

      const width =
        selectedTheme === null
          ? 520
          : selectedTheme === "maple"
            ? 240
            : 320

      await appWindow.setSize(
        new LogicalSize(
          width,
          Math.ceil(height + 10),
        ),
      )
    }

    const observer =
      new ResizeObserver(resize)

    observer.observe(content)

    resize()

    return () =>
      observer.disconnect()
  }, [selectedTheme])

  /* =======================================================
     Landing
  ======================================================= */

  if (selectedTheme === null) {
    return (
      <main className="app landing-app">
        <section
          ref={contentRef}
          className="landing-wrapper"
        >
          <Landing
            onSelectTheme={
              setSelectedTheme
            }
          />
        </section>
      </main>
    )
  }

  /* =======================================================
     Placeholder Themes
  ======================================================= */

  if (
    selectedTheme === "lostark" ||
    selectedTheme === "genshin"
  ) {
    const isLostArk =
      selectedTheme === "lostark"

    return (
      <main className="app">
        <section
          ref={contentRef}
          className="coming-soon"
          onMouseDown={
            handleWindowDrag
          }
        >
          <span className="coming-label">
            {isLostArk
              ? "LOST ARK"
              : "GENSHIN"}
          </span>

          <strong>
            {isLostArk
              ? "로스트아크 테마"
              : "원신 테마"}
          </strong>

          <p>
            디자인 구현 준비 중
          </p>

          <div className="coming-actions">
            <button
              type="button"
              onClick={() =>
                setSelectedTheme(null)
              }
            >
              ← 테마 선택
            </button>

            <button
              type="button"
              onClick={closeWindow}
            >
              종료
            </button>
          </div>
        </section>
      </main>
    )
  }

  /* =======================================================
     Maple Theme
  ======================================================= */

  return (
    <main className="app">
      <section
        ref={contentRef}
        className="quest-hud"
        onMouseDown={
          handleWindowDrag
        }
      >
        {/* Header */}

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
                setEditingProgressId(
                  null,
                )

                setIsAdding(
                  (previous) =>
                    !previous,
                )
              }}
            >
              +
            </button>

            <button
              className="minimize"
              type="button"
              aria-label="Minimize"
              onClick={minimizeWindow}
            >
              <span />
            </button>

            <button
              className="close"
              type="button"
              aria-label="Close"
              onClick={closeWindow}
            >
              ×
            </button>
          </div>
        </header>

        {/* Quest List */}

        <div className="quest-list">
          {quests.map((quest) => {
            const actionsOpen =
              selectedQuestId ===
              quest.id

            const progressOpen =
              editingProgressId ===
              quest.id

            return (
              <div
                key={quest.id}
                className={[
                  "quest-body",
                  quest.completed
                    ? "quest-completed"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
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

                {/* Quest actions */}

                {actionsOpen && (
                  <div className="quest-actions">
                    {quest.completed ? (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          deleteQuest(
                            quest.id,
                          )
                        }
                      >
                        삭제
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="complete-button"
                          onClick={() =>
                            completeQuest(
                              quest.id,
                            )
                          }
                        >
                          완료
                        </button>

                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() =>
                            setSelectedQuestId(
                              null,
                            )
                          }
                        >
                          취소
                        </button>
                      </>
                    )}
                  </div>
                )}

                <div className="objective-row">
                  <span className="objective">
                    {quest.objective}
                  </span>

                  {/* Single */}

                  {quest.progressType ===
                    "single" &&
                    quest.completed && (
                      <span className="single-complete">
                        ✓
                      </span>
                    )}

                  {/* Count */}

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
                              {
                                quest.progress
                              }
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
                              {
                                quest.progress
                              }
                            </span>

                            {!progressOpen && (
                              <span className="progress-total">
                                /
                                {
                                  quest.total
                                }
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
                                /
                                {
                                  quest.total
                                }
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

        {/* Add Quest */}

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

            <div className="progress-type">
              <button
                type="button"
                className={
                  progressType ===
                  "single"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setProgressType(
                    "single",
                  )
                }
              >
                단발성
              </button>

              <button
                type="button"
                className={
                  progressType ===
                  "count"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setProgressType(
                    "count",
                  )
                }
              >
                수량형
              </button>
            </div>

            {progressType ===
              "count" && (
              <div className="progress-inputs">
                <input
                  type="number"
                  min="0"
                  value={progress}
                  onChange={(event) =>
                    setProgress(
                      Number(
                        event.target
                          .value,
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
                        event.target
                          .value,
                      ),
                    )
                  }
                />
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={
                  closeAddForm
                }
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
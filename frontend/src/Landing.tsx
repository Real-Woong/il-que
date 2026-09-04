export type Theme = "maple" | "lostark" | "genshin"

type LandingProps = {
  onSelectTheme: (theme: Theme) => void
}

function Landing({
  onSelectTheme,
}: LandingProps) {
  return (
    <section className="landing">
      <header
        className="landing-header"
        data-tauri-drag-region
      >
        <div>
          <h1>IL-QUE</h1>
          <p>오늘의 일퀘를 선택하세요.</p>
        </div>
      </header>

      <div className="theme-grid">
        {/* MapleStory */}

        <button
          type="button"
          className="theme-card maple-card"
          onClick={() =>
            onSelectTheme("maple")
          }
        >
          <span className="theme-status">
            AVAILABLE
          </span>

          <div className="theme-preview maple-preview">
            <span>QUEST HELPER</span>

            <div>
              <strong>과제</strong>
              <p>오늘의 퀘스트</p>
            </div>
          </div>

          <div className="theme-info">
            <strong>메이플</strong>
            <span>Quest Helper</span>
          </div>
        </button>

        {/* Lost Ark */}

        <button
          type="button"
          className="theme-card lostark-card"
          onClick={() =>
            onSelectTheme("lostark")
          }
        >
          <span className="theme-status">
            PREVIEW
          </span>

          <div className="theme-preview lostark-preview">
            <span className="lostark-symbol">
              ◆
            </span>

            <div>
              <strong>메인 퀘스트</strong>
              <p>목표를 완료하세요</p>
            </div>
          </div>

          <div className="theme-info">
            <strong>로스트아크</strong>
            <span>Quest Tracker</span>
          </div>
        </button>

        {/* Genshin */}

        <button
          type="button"
          className="theme-card genshin-card"
          onClick={() =>
            onSelectTheme("genshin")
          }
        >
          <span className="theme-status">
            PREVIEW
          </span>

          <div className="theme-preview genshin-preview">
            <span className="genshin-symbol">
              ◇
            </span>

            <div>
              <strong>현재 임무</strong>
              <p>목표를 추적하세요</p>
            </div>
          </div>

          <div className="theme-info">
            <strong>원신</strong>
            <span>Objective Tracker</span>
          </div>
        </button>
      </div>

      <footer className="landing-footer">
        일일 퀘스트 · 일상 퀘스트
      </footer>
    </section>
  )
}

export default Landing
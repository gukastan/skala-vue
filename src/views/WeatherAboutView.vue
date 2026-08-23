<script setup>
import busanBackground from '../assets/pixel/busan-bg.png'
import happyPet from '../assets/pixel/pet-puppy-happy.png'
</script>

<template>
  <section class="service-page" aria-labelledby="service-title">
    <header class="hero-panel">
      <div class="hero-copy">
        <p class="eyebrow">WEATHER + PET + VUE</p>
        <h1 id="service-title">도시를 고르고 돌보면, <span>구름이와 화면은 왜 함께 변할까?</span></h1>
        <p class="hero-lead">
          도시 선택은 배경·날씨·메시지를 바꾸고, 돌봄과 시간의 흐름은 펫 상태를 바꿉니다. 학습모드에서는 이 변화를 만든 Vue의 흐름까지 확인합니다.
        </p>

        <nav class="hero-actions" aria-label="서비스 소개 바로가기">
          <RouterLink class="action-link primary" to="/">사용자 모드 체험</RouterLink>
          <RouterLink class="action-link secondary" to="/how-it-works">구현 원리 보기 <span aria-hidden="true">→</span></RouterLink>
        </nav>
      </div>

      <figure class="pet-scene">
        <img class="scene-background" :src="busanBackground" alt="" width="1672" height="941" aria-hidden="true" />
        <div class="scene-shade" aria-hidden="true"></div>
        <img class="scene-pet" :src="happyPet" alt="부산 날씨를 여행 중인 구름이" width="1254" height="1254" />
        <figcaption>
          <span>BUSAN · CLOUDY</span>
          <strong>날씨 데이터 → 펫 환경·돌봄 반응</strong>
        </figcaption>
      </figure>
    </header>

    <div class="story-grid">
      <article class="compare-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">FROM OUTPUT TO EXPERIENCE</p>
            <h2>날씨 확인에서 끝나지 않도록</h2>
          </div>
          <span class="section-number" aria-hidden="true">01</span>
        </div>

        <div class="compare-paths">
          <section class="path-card before" aria-labelledby="before-title">
            <h3 id="before-title">일반 날씨 앱</h3>
            <ol class="compact-flow">
              <li>도시 선택</li>
              <li>날씨 출력</li>
              <li>종료</li>
            </ol>
          </section>

          <span class="compare-arrow" aria-hidden="true">→</span>

          <section class="path-card after" aria-labelledby="after-title">
            <h3 id="after-title">Weather Pet</h3>
            <ol class="compact-flow">
              <li>도시 배경</li>
              <li>펫 상태</li>
              <li>돌봄 행동</li>
              <li>학습모드</li>
            </ol>
          </section>
        </div>
      </article>

      <aside class="reactivity-panel" aria-labelledby="reactivity-title">
        <div class="section-heading compact">
          <div>
            <p class="eyebrow">VUE IN ACTION</p>
            <h2 id="reactivity-title">결과와 원리를 함께 본다</h2>
          </div>
          <span class="section-number" aria-hidden="true">02</span>
        </div>

        <ol class="reactivity-flow">
          <li><code>@click</code><span>도시 선택</span></li>
          <li><code>ref</code><span>상태 변경</span></li>
          <li><code>computed</code><span>값 재계산</span></li>
          <li><code>template</code><span>화면 갱신</span></li>
        </ol>

        <RouterLink class="practice-link" to="/practice">48개 실습으로 다시 확인 <span aria-hidden="true">→</span></RouterLink>
      </aside>
    </div>

    <dl class="proof-strip" aria-label="Weather Pet 주요 구성">
      <div><dt>도시</dt><dd><strong>4</strong><span>전주 · 부산 · 광주 · 천안</span></dd></div>
      <div><dt>실습</dt><dd><strong>48</strong><span>수업 예제를 한곳에서 실행</span></dd></div>
      <div><dt>날씨 데이터</dt><dd><strong>API + MOCK</strong><span>실시간 항목과 기본 데이터를 함께 사용</span></dd></div>
    </dl>
  </section>
</template>

<style scoped>
.service-page {
  display: grid;
  grid-template-rows: minmax(0, 1.08fr) minmax(0, 0.92fr) 84px;
  gap: var(--space-4);
  height: 100%;
  min-height: 0;
  color: var(--ink);
}

.hero-panel,
.compare-panel,
.reactivity-panel,
.proof-strip {
  border: 3px solid var(--line-strong);
  box-shadow: 0 4px 0 var(--shadow-pink);
}

.hero-panel {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--radius-3xl);
  background: var(--panel);
}

.hero-copy {
  display: grid;
  align-content: center;
  padding: var(--space-6) var(--space-8);
}

.eyebrow {
  margin: 0 0 var(--space-2);
  color: var(--accent-deep);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.hero-copy h1 {
  max-width: 680px;
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.04em;
  text-wrap: balance;
}

.hero-copy h1 span { color: var(--accent-deep); }

.hero-lead {
  max-width: 660px;
  margin: var(--space-3) 0 0;
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  text-wrap: pretty;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.action-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: var(--space-2) var(--space-4);
  border: 3px solid var(--line-strong);
  border-radius: var(--radius-md);
  color: var(--ink);
  background: var(--surface-soft);
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}

.action-link.primary {
  color: var(--ink);
  background: var(--blue);
  box-shadow: 0 3px 0 var(--accent-strong);
}

.action-link:hover { background: var(--cream); }
.action-link.primary:hover { background: var(--accent-strong); }
.action-link:active { transform: translateY(2px); }
.action-link:focus-visible,
.practice-link:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }

.pet-scene {
  position: relative;
  min-height: 0;
  margin: var(--space-3);
  overflow: hidden;
  border: 3px solid var(--line-strong);
  border-radius: var(--radius-xl);
  background: var(--lavender);
}

.scene-background,
.scene-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.scene-background { object-fit: cover; }
.scene-shade { background: linear-gradient(180deg, transparent 38%, color-mix(in srgb, var(--ink) 72%, transparent)); }

.scene-pet {
  position: absolute;
  right: 4%;
  bottom: 3%;
  z-index: 1;
  width: 64%;
  height: auto;
  filter: drop-shadow(0 8px 0 color-mix(in srgb, var(--ink) 26%, transparent));
}

.pet-scene figcaption {
  position: absolute;
  left: var(--space-4);
  bottom: var(--space-4);
  z-index: 2;
  display: grid;
  gap: var(--space-1);
  max-width: 48%;
  color: var(--panel);
  text-shadow: 0 2px 0 var(--ink);
}

.pet-scene figcaption span { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; }
.pet-scene figcaption strong { font-size: 14px; line-height: 1.35; text-wrap: balance; }

.story-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr);
  gap: var(--space-4);
  min-height: 0;
}

.compare-panel,
.reactivity-panel {
  min-height: 0;
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-2xl);
  background: var(--panel);
}

.reactivity-panel { background: var(--cream); }

.section-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.section-heading.compact { margin-bottom: var(--space-2); }
.section-heading .eyebrow { margin-bottom: var(--space-1); }
.section-heading h2 { margin: 0; font-size: 18px; font-weight: 800; line-height: 1.35; letter-spacing: -0.01em; }
.section-number { color: color-mix(in srgb, var(--blue) 58%, var(--panel)); font-size: 22px; font-weight: 800; line-height: 1; }

.compare-paths {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) auto minmax(0, 1.2fr);
  align-items: stretch;
  gap: var(--space-3);
}

.path-card {
  padding: var(--space-3);
  border: 2px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-soft);
}

.path-card.after { background: color-mix(in srgb, var(--mint) 78%, var(--panel)); }
.path-card h3 { margin: 0 0 var(--space-2); font-size: 12px; font-weight: 800; }

.compact-flow,
.reactivity-flow {
  margin: 0;
  padding: 0;
  list-style: none;
}

.compact-flow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.compact-flow li {
  position: relative;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  color: var(--muted);
  background: var(--panel);
  font-size: 11px;
  font-weight: 700;
}

.compact-flow li:not(:last-child)::after {
  position: absolute;
  top: 50%;
  right: calc(var(--space-2) * -1);
  z-index: 1;
  color: var(--accent-deep);
  content: '→';
  font-weight: 800;
  transform: translate(50%, -50%);
}

.compare-arrow { align-self: center; color: var(--blue); font-size: 22px; font-weight: 800; }

.reactivity-flow {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-2);
}

.reactivity-flow li {
  position: relative;
  display: grid;
  gap: var(--space-1);
  min-width: 0;
  padding: var(--space-2);
  border: 2px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel);
}

.reactivity-flow li:not(:last-child)::after {
  position: absolute;
  top: 50%;
  right: calc(var(--space-2) * -1);
  z-index: 1;
  color: var(--accent-deep);
  content: '→';
  font-size: 11px;
  font-weight: 800;
  transform: translate(50%, -50%);
}

.reactivity-flow code { color: var(--accent-deep); font-size: 11px; font-weight: 800; }
.reactivity-flow span { color: var(--muted); font-size: 11px; font-weight: 600; }

.practice-link {
  display: inline-flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
  color: var(--accent-deep);
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}

.practice-link:hover { color: var(--ink); text-decoration: underline; text-underline-offset: var(--space-1); }
.practice-link:active { color: var(--ink); transform: translateY(2px); }

.proof-strip {
  display: grid;
  grid-template-columns: 0.8fr 0.9fr 1.3fr;
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: var(--cream);
}

.proof-strip > div {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  padding: var(--space-3) var(--space-5);
}

.proof-strip > div + div { border-left: 2px solid var(--line); }
.proof-strip dt { color: var(--muted); font-size: 10px; font-weight: 800; letter-spacing: 0.08em; }
.proof-strip dd { display: grid; gap: var(--space-1); min-width: 0; margin: 0; }
.proof-strip strong { color: var(--accent-deep); font-size: 20px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.proof-strip span { overflow: hidden; color: var(--muted); font-size: 11px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }

</style>

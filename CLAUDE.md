# sadrobot AI Daily – fejlesztői jegyzet

Napi, automatikus, világméretű AI-hírösszefoglaló statikus oldalként (RSS/HTML/Google News → napi JSON → AI-szerkesztés → Vite/React). A cyber-news testvérprojektje, ugyanabból a kódból, szélesebb közönségnek. Felhasználói leírás: README.md; agent-szabályok és szerkesztői JSON-szerződés: AGENTS.md (gitignored, csak lokálisan).

## Indítás és teszt
- Node nincs a PATH-on: `export PATH=$HOME/Claude_code/gue-dive-planner/.node/bin:$PATH`.
- Dev szerver: launch.json `ai-news` (port 5176, sadrobot arculat) és `ai-news-yettel` (port 5179, `VITE_BRAND=yettel`). A README-ben szereplő 5173 a Vite alapértéke, nem a launch-konfig.
- `npm run collect -- --no-llm` (heurisztikus mai kiadás), `--keep-all` (minden jelölt, `editorial: "pending"`), `--seed-html` (új HTML-forrás után egyszer: a listaoldal linkjeit látottnak jelöli, majd commitold a `data/seen-urls.json`-t).
- `node scripts/apply-editorial.mjs <DATE> work/editorial.json`, `npm run build` (index + tsc + vite). Automatikus teszt nincs; a build (tsc) az ellenőrzés.

## Felépítés
- `config/feeds.json` – 9 kategória, 51 forrás (`type: "html"` listaoldal, `via: "google-news"` proxy, sima RSS/Atom).
- `scripts/collect.mjs` – gyűjtés, 30 órás ablak, dedupe, sanitize → `public/data/days/YYYY-MM-DD.json`. Közvetlen Claude API-ág (`ANTHROPIC_API_KEY`) létezik, élesben nem használjuk.
- `scripts/apply-editorial.mjs` – szerkesztői JSON validálása és beolvasztása: max 6 hír/kategória, relevancia ≥ 3, `duplicateOf` eldobva, angol `title` + `originalTitle`.
- `scripts/daily.sh prepare|publish <json>` – az ütemezett feladat EGYETLEN shell-belépési pontja (pull → collect; apply → build → commit → push retry-jal).
- `scripts/build-index.mjs` – `public/data/index.json` (MiniSearch-korpusz, gitignored).
- `src/brand.ts` + `vite.config.ts` `brand` plugin – build-idejű `VITE_BRAND` kapcsoló. `src/ViewCounter.tsx` – azonos originű `/_views.json` (sadrobot Status), máshol nem jelenik meg.
- `docs/HANDOFF.md`, `docs/editorial-task-prompt.md` – gitignored, csak lokálisan.

## Kategóriák
`models-releases`, `research`, `agents-tools`, `ai-security` (támadás AZ AI ellen), `ai-threats` (AI-t használó támadók/védők), `safety-evals`, `policy-regulation` (EU + HU), `industry-compute`, `incidents-society`.

## Telepítés / kiadás
- Napi folyamat: helyi Claude Desktop ütemezett feladat írja a `work/editorial.json`-t, majd `daily.sh publish` commitol és pushol. A push indítja a `.github/workflows/daily.yml`-t: build + GitHub Pages deploy.
- Biztonsági háló: a workflow cronja 08:30 UTC-kor heurisztikus kiadást gyűjt, ha a mai fájl hiányzik (`editorial: "heuristic"`); a szerkesztett kiadás később felülírja.
- Két arculat, egy kódbázis: GitHub Pages (`VITE_BRAND=yettel`) → Yettel AI Daily a krisztianhari-wq.github.io/ai-news címen; változó nélküli build → sadrobot AI Daily az ai.sadrobot.eu címen. A szerver félóránként maga húzza és építi a repót (sadrobot-infra `scripts/sync-news.sh`), kézi deploy nem kell. Szerverdolgokhoz lásd /deploy-sadrobot skill és sadrobot-infra/SADROBOT-INFRA.md.
- Verzió: nincs kiadási ciklus (a `package.json` 0.1.0); ha mégis kell, /release skill.

## Döntések
1. Nincs API-kulcs és nincs GitHub↔Claude kapcsolat (céges szabály), ezért felhős rutin és API-ág kizárva; a helyi Desktop ütemezett feladat a jóváhagyott út.
2. A közösségi poszt privát: csak a gitignored `posts/` és a feladat zárójelentése. Soha ne kerüljön a day JSON-ba, az oldalra, commitba, és soha ne posztoljuk automatikusan.
3. Statikus, backend nélkül; a feed-tartalom megbízhatatlan adat (HTML strip, csak http(s) link, szigorú CSP, nincs `dangerouslySetInnerHTML`).
4. Átfedés a cyber-news AI Security kategóriájával szándékos (a tulajdonos döntése, más közönség).
5. Nézettségszámláló: GoatCounter helyett szerveroldali sadrobot Status (süti és harmadik fél nélkül); a Pages-buildben nincs számláló.
6. Commitba csak `public/data/days/*.json` és `data/seen-urls.json` kerül a napi futásból; `posts/`, `work/` soha.

## Buktatók
- Versenyhelyzet: ha az ütemezett feladat 08:30 UTC után fut, a bot előbb pushol egy heurisztikus napot. Ezért `daily.sh` `sync()` = `pull --rebase --autostash -X theirs` (a helyi szerkesztés nyer) + JSON-validálás, a push-retry előtt is.
- A Git-remote SSH a 443-as porton (`ssh://git@ssh.github.com:443/...`), mert a 22-es port a céges hálón tiltott.
- Ha egy futás „running” állapotban áll commit nélkül, először függő jóváhagyást keress az ütemezett feladat sessionjében.

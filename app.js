(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const COURSE = window.COURSE;
const MAX_HEARTS = 5, REFILL_MIN = 20, DAILY_GOAL = 30;

/* ---------------- état sauvegardé ---------------- */
const KEY = "pyquest-v1";
const dayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const defaults = () => ({ done: {}, xp: 0, streak: 0, best: 0, lastDay: null, days: [], hearts: MAX_HEARTS, heartTs: Date.now(), daily: { day: dayStr(), xp: 0 }, weak: {}, sound: true, answered: 0, correct: 0 });
let S;
try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { S = defaults(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

function refreshTime() {
  const today = dayStr();
  if (S.daily.day !== today) S.daily = { day: today, xp: 0 };
  const y = new Date(); y.setDate(y.getDate() - 1);
  if (S.lastDay && S.lastDay !== today && S.lastDay !== dayStr(y)) S.streak = 0; // série cassée
  if (S.hearts < MAX_HEARTS) {
    const gained = Math.floor((Date.now() - S.heartTs) / (REFILL_MIN * 60000));
    if (gained > 0) { S.hearts = Math.min(MAX_HEARTS, S.hearts + gained); S.heartTs = Date.now(); }
  } else S.heartTs = Date.now();
  save();
}

/* ---------------- structure du parcours ---------------- */
const NODES = []; // liste globale ordonnée
COURSE.forEach((u, ui) => {
  const n = u.ex.length, half = Math.ceil(n / 2);
  const all = u.ex.map((_, i) => i);
  [
    { label: "Leçon 1", icon: "⭐", idx: all.slice(0, half) },
    { label: "Leçon 2", icon: "⭐", idx: all.slice(half) },
    { label: "Révision", icon: "🏆", idx: all }
  ].forEach((nd, ni) => NODES.push({ ...nd, ui, ni, key: `${ui}-${ni}` }));
});
const isUnlocked = (g) => g === 0 || !!S.done[NODES[g - 1].key];
const currentNode = () => NODES.findIndex((nd, g) => isUnlocked(g) && !S.done[nd.key]);

/* ---------------- mascotte (serpent original) ---------------- */
function mascot(mood = "happy") {
  const mouth = mood === "sad"
    ? '<path d="M50 41 q8 -6 16 0" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>'
    : '<path d="M49 38 q9 9 18 0" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>';
  return `
  <path d="M46 50 C 22 58, 20 84, 46 86 S 84 84, 86 66" stroke="#2563eb" stroke-width="15" fill="none" stroke-linecap="round"/>
  <path d="M46 50 C 22 58, 20 84, 46 86 S 84 84, 86 66" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="2 9"/>
  <circle cx="58" cy="30" r="24" fill="#2563eb"/>
  <circle cx="48" cy="25" r="7.5" fill="#fff"/><circle cx="68" cy="25" r="7.5" fill="#fff"/>
  <circle cx="49.5" cy="26" r="3.6" fill="#0f172a"/><circle cx="69.5" cy="26" r="3.6" fill="#0f172a"/>
  <circle cx="44" cy="35" r="3" fill="#facc15" opacity=".8"/><circle cx="72" cy="35" r="3" fill="#facc15" opacity=".8"/>
  ${mouth}
  ${mood === "happy" ? '<path d="M58 47 v6 l-3 4 M58 53 l3 4" stroke="#ef4444" stroke-width="2.2" fill="none" stroke-linecap="round"/>' : ""}`;
}
$$("[data-mascot]").forEach(el => el.innerHTML = mascot());

/* ---------------- son ---------------- */
let AC;
function beep(notes) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    let t = AC.currentTime;
    notes.forEach(([f, d, type = "sine"]) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + 0.02); t += d * 0.8;
    });
  } catch {}
}
const sfx = {
  good: () => beep([[660, .12], [990, .2]]),
  bad: () => beep([[200, .25, "square"]]),
  win: () => beep([[523, .15], [659, .15], [784, .15], [1047, .35]]),
  tap: () => beep([[440, .04]])
};
const vibrate = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };

/* ---------------- utilitaires ---------------- */
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KW = new Set("def return if elif else for while in not and or True False None import from as class try except finally with lambda pass break continue is global".split(" "));
const BI = new Set("print len range input int str float bool list dict type sum max min sorted abs round".split(" "));
function hl(src) {
  const re = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    if (m[1]) out += `<span class="cm">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="st">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="nu">${m[3]}</span>`;
    else out += KW.has(m[4]) ? `<span class="kw">${m[4]}</span>` : BI.has(m[4]) ? `<span class="bi">${m[4]}</span>` : m[4];
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}
const norm = (s) => s.trim().replace(/[‘’']/g, '"').replace(/[“”«»]/g, '"').replace(/\s+/g, "").toLowerCase();
let toastT;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2200); }
function show(id) { $$(".screen").forEach(s => s.classList.toggle("on", s.id === id)); }
function openSheet(html) { $("#sheet").innerHTML = html; $("#modal").classList.add("on"); }
function closeSheet() { $("#modal").classList.remove("on"); }
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeSheet(); });

/* ---------------- barre d'état ---------------- */
function renderStats() {
  const today = dayStr();
  $("#st-streak").textContent = `🔥 ${S.streak}`;
  $("#st-streak").classList.toggle("dim", S.lastDay !== today);
  $("#st-xp").textContent = `⭐ ${S.xp}`;
  $("#st-hearts").textContent = `❤️ ${S.hearts}`;
}

/* ---------------- vue Parcours ---------------- */
function renderPath() {
  const cur = currentNode();
  const pct = Math.min(100, Math.round(S.daily.xp / DAILY_GOAL * 100));
  let h = `<div class="goal"><span style="font-size:28px">🎯</span><div style="flex:1">
    <div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:6px"><span>Objectif du jour</span><small>${Math.min(S.daily.xp, DAILY_GOAL)} / ${DAILY_GOAL} XP</small></div>
    <div class="bar"><i style="width:${pct}%"></i></div></div></div>`;
  const offsets = [0, 52, 0, -52];
  COURSE.forEach((u, ui) => {
    const nodes = NODES.filter(n => n.ui === ui);
    const g0 = NODES.indexOf(nodes[0]);
    const locked = !isUnlocked(g0);
    const doneCount = nodes.filter(n => S.done[n.key]).length;
    h += `<div class="unit ${locked ? "locked" : ""}" id="unit-${ui}">
      <div class="unit-head" style="background:${u.color}">
        <div><p>Unité ${ui + 1} · ${doneCount}/${nodes.length}</p><h2>${u.icon} ${u.title}</h2></div>
        <button data-tip="${ui}">📘 Mémo</button>
      </div><div class="path">`;
    nodes.forEach((nd, k) => {
      const g = NODES.indexOf(nd);
      const st = S.done[nd.key] ? "done" : isUnlocked(g) ? "" : "locked";
      const isCur = g === cur;
      const colors = st === "locked" ? "" : `--bg-n:${u.color};--sh:color-mix(in srgb, ${u.color} 70%, #000)`;
      h += `<div class="nwrap" style="transform:translateX(${offsets[k % 4]}px)">
        <button class="node ${st} ${isCur ? "current" : ""}" data-node="${g}" style="${colors}">${st === "locked" ? "🔒" : nd.icon}</button>
        <div class="node-label">${nd.label}</div></div>`;
    });
    h += `</div></div>`;
  });
  if (cur === -1) h += `<div class="panel" style="text-align:center"><h3>🎓 Parcours terminé !</h3><p style="color:var(--muted);font-weight:600;margin:0">Bravo, tu as fini tout le cours. Continue avec l'Entraînement pour garder ta série.</p></div>`;
  $("#v-path").innerHTML = h;
}
$("#v-path").addEventListener("click", e => {
  const tip = e.target.closest("[data-tip]");
  if (tip) { const u = COURSE[+tip.dataset.tip]; openSheet(`<h2>${u.icon} ${u.title}</h2><div class="tipbody">${u.tip}</div><button class="btn" id="close-sheet">Compris !</button>`); $("#close-sheet").onclick = closeSheet; return; }
  const nb = e.target.closest("[data-node]");
  if (!nb) return;
  const g = +nb.dataset.node, nd = NODES[g];
  if (!isUnlocked(g)) { toast("🔒 Termine la leçon précédente d'abord"); vibrate(30); return; }
  const u = COURSE[nd.ui];
  openSheet(`<h2>${u.icon} ${u.title} — ${nd.label}</h2>
    <p style="color:var(--muted);font-weight:600;margin:0">${nd.idx.length} exercices${S.done[nd.key] ? " · déjà réussie, rejoue pour gagner de l'XP" : ""}</p>
    <button class="btn green" id="go">${S.done[nd.key] ? "Rejouer" : "Commencer"} (+XP)</button>
    <button class="btn ghost" id="memo" style="margin-top:10px">📘 Voir le mémo</button>`);
  $("#go").onclick = () => { closeSheet(); startLesson({ type: "node", g }); };
  $("#memo").onclick = () => { openSheet(`<h2>${u.icon} ${u.title}</h2><div class="tipbody">${u.tip}</div><button class="btn green" id="go2">Commencer</button>`); $("#go2").onclick = () => { closeSheet(); startLesson({ type: "node", g }); }; };
});

/* ---------------- vue Entraînement ---------------- */
function unlockedUnits() { const s = new Set(); NODES.forEach((n, g) => { if (isUnlocked(g)) s.add(n.ui); }); return [...s]; }
function renderPractice() {
  const weakN = Object.keys(S.weak).length;
  $("#v-practice").innerHTML = `
    <div class="panel" style="text-align:center">
      <svg viewBox="0 0 100 100" style="width:110px;height:110px">${mascot()}</svg>
      <h3>Entraînement</h3>
      <p style="color:var(--muted);font-weight:600;margin:0 0 14px">8 questions tirées des unités débloquées.<br>Tu ne perds pas de cœur ici, et tu en regagnes un à la fin !</p>
      <button class="btn green" id="pr-mix">🏋️ Entraînement rapide</button>
      <button class="btn" id="pr-weak" style="margin-top:12px" ${weakN ? "" : "disabled"}>🎯 Revoir mes erreurs (${weakN})</button>
    </div>
    <div class="panel"><h3>📚 Mémos des unités</h3>
      ${COURSE.map((u, ui) => `<div class="row"><span>${u.icon} ${u.title}</span><button class="btn ghost" style="width:auto;padding:8px 12px;font-size:13px" data-tip2="${ui}" ${unlockedUnits().includes(ui) ? "" : "disabled"}>Lire</button></div>`).join("")}
    </div>`;
  $("#pr-mix").onclick = () => startLesson({ type: "practice" });
  $("#pr-weak").onclick = () => startLesson({ type: "weak" });
  $$("[data-tip2]").forEach(b => b.onclick = () => { const u = COURSE[+b.dataset.tip2]; openSheet(`<h2>${u.icon} ${u.title}</h2><div class="tipbody">${u.tip}</div><button class="btn" id="close-sheet">Fermer</button>`); $("#close-sheet").onclick = closeSheet; });
}

/* ---------------- comptes & classement (Supabase) ---------------- */
const CFG = window.PYQ_CONFIG || {};
let sb = null, user = null, profile = null;
try { if (CFG.url && CFG.key && window.supabase) sb = window.supabase.createClient(CFG.url, CFG.key); } catch {}
const ERRS = [
  [/invalid login/i, "E-mail ou mot de passe incorrect."],
  [/already registered|already exists/i, "Un compte existe déjà avec cet e-mail."],
  [/password/i, "Le mot de passe doit faire au moins 6 caractères."],
  [/valid email|email.*invalid|invalid.*email/i, "Adresse e-mail invalide."],
  [/rate limit|too many/i, "Trop d'essais, réessaie dans quelques minutes."],
  [/fetch|network|load failed/i, "Pas de connexion internet."]
];
const frErr = (e) => { const m = (e && e.message) || String(e); const f = ERRS.find(([re]) => re.test(m)); return f ? f[1] : m; };
const PSEUDO_RE = /^[A-Za-z0-9_-]{3,20}$/;

async function loadAccount() {
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  user = (data.session && data.session.user) || null;
  profile = null;
  if (!user) return;
  const { data: p } = await sb.from("profiles").select("pseudo").eq("id", user.id).maybeSingle();
  profile = p || null;
}
// preferRemote = true à la connexion (la progression du compte remplace celle du téléphone)
async function pullProgress(preferRemote) {
  const { data, error } = await sb.from("progress").select("state").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  if (data && data.state) {
    const remote = Object.assign(defaults(), data.state);
    if (preferRemote) S = remote;
    else {
      const base = remote.xp >= S.xp ? remote : S;
      base.done = Object.assign({}, remote.done, S.done);
      base.days = [...new Set([...(remote.days || []), ...(S.days || [])])].sort().slice(-60);
      base.best = Math.max(remote.best || 0, S.best || 0);
      base.pendingXp = S.pendingXp || 0;
      S = base;
    }
    save();
  }
  await pushProgress();
}
async function pushProgress() {
  if (!sb || !user) return;
  try { await sb.from("progress").upsert({ user_id: user.id, state: S, updated_at: new Date().toISOString() }); } catch {}
}
async function flushXp() {
  if (!sb || !user || !profile || !(S.pendingXp > 0)) return;
  const amount = Math.min(S.pendingXp, 60);
  try { const { error } = await sb.rpc("add_xp", { amount }); if (!error) { S.pendingXp -= amount; save(); } } catch {}
}
async function syncNow() { await flushXp(); await pushProgress(); }

function authSheet(mode) {
  const su = mode === "signup";
  openSheet(`<h2>${su ? "✨ Créer un compte" : "👋 Se connecter"}</h2>
    <p class="muted">${su ? "Ta progression sera sauvegardée et tu apparaîtras dans le classement." : "Retrouve ta progression sur cet appareil."}</p>
    <form class="form" id="af" novalidate>
      ${su ? `<label>Pseudo (visible dans le classement)<input name="pseudo" maxlength="20" autocomplete="nickname" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="ex : Python_Master"></label>` : ""}
      <label>E-mail<input name="email" type="email" autocomplete="email" autocapitalize="off" spellcheck="false"></label>
      <label>Mot de passe<input name="pw" type="password" autocomplete="${su ? "new-password" : "current-password"}" placeholder="${su ? "6 caractères minimum" : ""}"></label>
      <div class="ferr" id="ferr"></div>
      <button class="btn green" id="asub">${su ? "Créer mon compte" : "Me connecter"}</button>
    </form>
    <button class="btn ghost" id="aswitch" style="margin-top:10px">${su ? "J'ai déjà un compte" : "Je n'ai pas de compte"}</button>`);
  $("#aswitch").onclick = () => authSheet(su ? "login" : "signup");
  $("#af").onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target), btn = $("#asub"), err = $("#ferr");
    const email = String(f.get("email") || "").trim(), pw = String(f.get("pw") || "");
    const pseudo = su ? String(f.get("pseudo") || "").trim() : "";
    if (su && !PSEUDO_RE.test(pseudo)) { err.textContent = "Pseudo : 3 à 20 caractères, lettres, chiffres, _ ou - (sans espace ni accent)."; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = "Adresse e-mail invalide."; return; }
    if (pw.length < 6) { err.textContent = "Le mot de passe doit faire au moins 6 caractères."; return; }
    btn.disabled = true; err.textContent = "";
    try {
      if (su) {
        const { data: taken } = await sb.from("profiles").select("id").ilike("pseudo", pseudo.replace(/[_%\\]/g, "\\$&")).maybeSingle();
        if (taken) throw new Error("Ce pseudo est déjà pris, choisis-en un autre.");
        const { data, error } = await sb.auth.signUp({ email, password: pw });
        if (error) throw error;
        if (!data.session) throw new Error("Compte créé : confirme ton e-mail, puis connecte-toi.");
        user = data.user;
        const { error: e2 } = await sb.from("profiles").insert({ id: user.id, pseudo });
        if (e2) { closeSheet(); return pseudoSheet("Ce pseudo vient d'être pris, choisis-en un autre."); }
        profile = { pseudo };
        S.pendingXp = (S.pendingXp || 0) + S.daily.xp; // l'XP gagné aujourd'hui compte déjà
        save();
        await syncNow();
        closeSheet(); renderAll(); toast(`Bienvenue ${pseudo} ! 🎉`);
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        await loadAccount();
        await pullProgress(true);
        closeSheet(); renderAll();
        if (!profile) pseudoSheet(); else toast(`Content de te revoir, ${profile.pseudo} !`);
      }
    } catch (ex) { err.textContent = frErr(ex); btn.disabled = false; }
  };
}
function pseudoSheet(msg) {
  openSheet(`<h2>Choisis ton pseudo</h2><p class="muted">${esc(msg || "Il sera affiché dans le classement.")}</p>
    <form class="form" id="pf" novalidate><label>Pseudo<input name="pseudo" maxlength="20" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
    <div class="ferr" id="ferr"></div><button class="btn green" id="psub">Valider</button></form>`);
  $("#pf").onsubmit = async (e) => {
    e.preventDefault();
    const pseudo = String(new FormData(e.target).get("pseudo") || "").trim(), err = $("#ferr");
    if (!PSEUDO_RE.test(pseudo)) { err.textContent = "3 à 20 caractères : lettres, chiffres, _ ou -."; return; }
    $("#psub").disabled = true;
    const { error } = await sb.from("profiles").insert({ id: user.id, pseudo });
    if (error) { err.textContent = /duplicate|unique/i.test(error.message) ? "Ce pseudo est déjà pris." : frErr(error); $("#psub").disabled = false; return; }
    profile = { pseudo }; await syncNow(); closeSheet(); renderAll(); toast(`Bienvenue ${pseudo} ! 🎉`);
  };
}
async function logout() {
  openSheet(`<h2>Se déconnecter ?</h2><p class="muted">Ta progression reste sauvegardée dans ton compte. Ce téléphone repartira de zéro jusqu'à ta prochaine connexion.</p>
    <button class="btn red" id="yes">Me déconnecter</button><button class="btn ghost" id="no" style="margin-top:10px">Annuler</button>`);
  $("#no").onclick = closeSheet;
  $("#yes").onclick = async () => {
    await pushProgress();
    try { await sb.auth.signOut(); } catch {}
    user = null; profile = null; S = defaults(); save(); closeSheet(); renderAll(); toast("Déconnecté");
  };
}

const AV_COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#6366f1"];
const avColor = (s) => AV_COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AV_COLORS.length];
async function renderBoard() {
  const v = $("#v-board");
  const dow = (new Date().getDay() + 6) % 7, days = 7 - dow;
  const head = `<div class="panel" style="text-align:center"><div style="font-size:46px;line-height:1">🏆</div><h3 style="margin:8px 0 4px">Classement de la semaine</h3>
    <p class="muted">Gagne de l'XP pour grimper ! Remise à zéro lundi${days === 1 ? " (demain)" : ` (dans ${days} jours)`}.</p></div>`;
  if (!sb) { v.innerHTML = head + `<div class="panel"><p class="muted">Le classement n'est pas disponible pour l'instant (pas de connexion internet ?).</p></div>`; return; }
  const cta = user && profile ? "" : `<div class="panel" style="text-align:center"><p class="muted" style="margin-bottom:12px">Crée un compte gratuit pour entrer dans le classement et retrouver ta progression sur tous tes appareils.</p>
    <button class="btn green" id="b-su">Créer un compte</button><button class="btn ghost" id="b-li" style="margin-top:10px">J'ai déjà un compte</button></div>`;
  v.innerHTML = head + cta + `<div class="panel" id="lb"><p class="muted">Chargement…</p></div>`;
  const su = $("#b-su"); if (su) { su.onclick = () => authSheet("signup"); $("#b-li").onclick = () => authSheet("login"); }
  await flushXp();
  let rows;
  try { const { data, error } = await sb.rpc("leaderboard"); if (error) throw error; rows = data || []; }
  catch (e) { if ($("#lb")) $("#lb").innerHTML = `<p class="muted">Impossible de charger le classement : ${esc(frErr(e))}</p>`; return; }
  if (!$("#lb")) return;
  if (!rows.length) { $("#lb").innerHTML = `<p class="muted" style="text-align:center">Personne n'a encore gagné d'XP cette semaine.<br>Fais une leçon pour prendre la 1re place ! 🚀</p>`; return; }
  const medal = { 1: "🥇", 2: "🥈", 3: "🥉" };
  let prev = 0;
  $("#lb").innerHTML = rows.map(r => {
    const gap = r.rk > prev + 1 && prev ? `<div class="lb-gap">⋮</div>` : "";
    prev = Number(r.rk);
    return gap + `<div class="lb-row ${r.is_me ? "me" : ""}"><div class="rk">${medal[r.rk] || r.rk}</div>
      <div class="av" style="background:${avColor(r.pseudo)}">${esc(r.pseudo[0].toUpperCase())}</div>
      <div class="nm">${esc(r.pseudo)}${r.is_me ? " (toi)" : ""}</div><div class="pts">${r.xp} XP</div></div>`;
  }).join("");
}

/* ---------------- vue Profil ---------------- */
let installEvt = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; if ($("#v-profile").hidden === false) renderProfile(); });
function renderProfile() {
  const doneN = Object.keys(S.done).length;
  const acc = S.answered ? Math.round(S.correct / S.answered * 100) : 0;
  const week = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); week.push(d); }
  const L = ["D", "L", "M", "M", "J", "V", "S"];
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let install = "";
  if (!standalone) {
    install = `<div class="panel"><h3>📲 Installer l'application</h3>` + (installEvt
      ? `<button class="btn green" id="install">Ajouter à l'écran d'accueil</button>`
      : ios ? `<p style="margin:0;font-weight:600;color:var(--muted)">Dans Safari : touche <b>Partager</b> <span style="font-size:18px">⎋</span> puis <b>« Sur l'écran d'accueil »</b>.</p>`
            : `<p style="margin:0;font-weight:600;color:var(--muted)">Dans le menu du navigateur (⋮), choisis <b>« Installer l'application »</b> ou <b>« Ajouter à l'écran d'accueil »</b>.</p>`) + `</div>`;
  }
  const acct = !sb ? "" : user
    ? `<div class="panel"><h3>👤 Mon compte</h3>
        <div class="row"><span>Pseudo</span><b>${esc(profile ? profile.pseudo : "—")}</b></div>
        <div class="row"><span>E-mail</span><span class="muted" style="overflow:hidden;text-overflow:ellipsis">${esc(user.email || "")}</span></div>
        <div class="row"><span>☁️ Progression sauvegardée</span><span>✅</span></div>
        <button class="btn ghost" id="logout" style="margin-top:8px">Se déconnecter</button></div>`
    : `<div class="panel"><h3>👤 Compte</h3><p class="muted" style="margin-bottom:12px">Sans compte, ta progression reste sur ce téléphone. Avec un compte, elle est sauvegardée et tu entres dans le classement.</p>
        <button class="btn green" id="p-su">Créer un compte</button><button class="btn ghost" id="p-li" style="margin-top:10px">Se connecter</button></div>`;
  $("#v-profile").innerHTML = acct + `
    <div class="panel"><h3>📊 Statistiques</h3><div class="grid2">
      <div class="kpi"><span>🔥</span><div><b>${S.streak}</b><small>jours de série</small></div></div>
      <div class="kpi"><span>⭐</span><div><b>${S.xp}</b><small>XP au total</small></div></div>
      <div class="kpi"><span>🏅</span><div><b>${doneN}/${NODES.length}</b><small>leçons réussies</small></div></div>
      <div class="kpi"><span>🎯</span><div><b>${acc}%</b><small>bonnes réponses</small></div></div>
    </div><p style="color:var(--muted);font-weight:700;font-size:13px;margin:10px 0 0">Record de série : ${S.best} jour${S.best > 1 ? "s" : ""}</p></div>
    <div class="panel"><h3>📅 Cette semaine</h3><div class="week">
      ${week.map(d => `<div class="day ${S.days.includes(dayStr(d)) ? "ok" : ""}">${L[d.getDay()]}<i>${S.days.includes(dayStr(d)) ? "🔥" : ""}</i></div>`).join("")}
    </div></div>
    ${install}
    <div class="panel"><h3>⚙️ Réglages</h3>
      <div class="row"><span>🔊 Sons</span><button class="switch ${S.sound ? "on" : ""}" id="sw-sound" aria-label="Sons"></button></div>
      <div class="row"><span>♻️ Réinitialiser la progression</span><button class="btn red" style="width:auto;padding:8px 12px;font-size:13px" id="reset">Effacer</button></div>
    </div>
    <p style="text-align:center;color:var(--muted);font-size:12px;font-weight:600">${user ? "Ta progression est sauvegardée dans ton compte." : "Ta progression est enregistrée sur cet appareil."}</p>`;
  if ($("#logout")) $("#logout").onclick = logout;
  if ($("#p-su")) { $("#p-su").onclick = () => authSheet("signup"); $("#p-li").onclick = () => authSheet("login"); }
  $("#sw-sound").onclick = () => { S.sound = !S.sound; save(); renderProfile(); sfx.tap(); };
  $("#reset").onclick = () => {
    openSheet(`<h2>Tout effacer ?</h2><p style="margin:0;font-weight:600;color:var(--muted)">Ton XP, ta série et tes leçons réussies seront supprimés. Impossible d'annuler.</p>
      <button class="btn red" id="yes">Oui, tout effacer</button><button class="btn ghost" id="no" style="margin-top:10px">Annuler</button>`);
    $("#yes").onclick = () => { S = defaults(); save(); closeSheet(); renderAll(); toast("Progression effacée"); };
    $("#no").onclick = closeSheet;
  };
  const ib = $("#install");
  if (ib) ib.onclick = async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; renderProfile(); };
}

/* ---------------- onglets ---------------- */
let tab = "path";
$$(".nav button").forEach(b => b.onclick = () => { tab = b.dataset.tab; sfx.tap(); renderAll(); });
function renderAll() {
  refreshTime();
  renderStats();
  $$(".nav button").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  ["path", "practice", "board", "profile"].forEach(t => $("#v-" + t).hidden = t !== tab);
  if (tab === "path") renderPath(); else if (tab === "practice") renderPractice(); else if (tab === "board") renderBoard(); else renderProfile();
}

/* ---------------- moteur de leçon ---------------- */
let L = null; // leçon en cours
function buildItem(ui, i) { return { ui, i, key: `${ui}:${i}`, ex: COURSE[ui].ex[i], retry: false }; }

function startLesson(opt) {
  refreshTime();
  let items;
  if (opt.type === "node") {
    if (S.hearts <= 0) return noHearts();
    const nd = NODES[opt.g];
    items = nd.idx.map(i => buildItem(nd.ui, i));
    if (nd.ni === 2) items = shuffle(items);
  } else if (opt.type === "weak") {
    items = shuffle(Object.keys(S.weak)).slice(0, 8).map(k => { const [u, i] = k.split(":").map(Number); return buildItem(u, i); });
  } else {
    const pool = [];
    unlockedUnits().forEach(ui => COURSE[ui].ex.forEach((_, i) => pool.push(buildItem(ui, i))));
    items = shuffle(pool).slice(0, 8);
  }
  if (!items.length) return toast("Rien à réviser pour l'instant 👍");
  L = { opt, queue: items, total: items.length, ok: 0, firstTry: 0, mistakes: 0, start: Date.now(), practice: opt.type !== "node" };
  show("s-lesson");
  nextExercise();
}

function noHearts() {
  const mins = REFILL_MIN - Math.floor((Date.now() - S.heartTs) / 60000);
  openSheet(`<h2>💔 Plus de cœurs</h2><p style="margin:0;font-weight:600;color:var(--muted)">Un cœur revient toutes les ${REFILL_MIN} min (prochain dans ~${Math.max(1, mins)} min).<br>Ou fais un entraînement pour en regagner un tout de suite !</p>
    <button class="btn green" id="pr">🏋️ S'entraîner</button><button class="btn ghost" id="no" style="margin-top:10px">Plus tard</button>`);
  $("#pr").onclick = () => { closeSheet(); startLesson({ type: "practice" }); };
  $("#no").onclick = () => { closeSheet(); show("s-home"); renderAll(); };
}

let cur = null; // exercice affiché : {ready, check(), solution, el}
function nextExercise() {
  if (!L.queue.length) return finishLesson();
  const it = L.queue[0];
  $("#prog").style.width = `${L.ok / L.total * 100}%`;
  $("#ls-hearts").textContent = L.practice ? "❤️ ∞" : `❤️ ${S.hearts}`;
  const foot = $("#footer"); foot.className = "footer"; $("#fb").innerHTML = "";
  const btn = $("#check"); btn.textContent = "Vérifier"; btn.className = "btn"; btn.disabled = true;
  const ex = it.ex, box = $("#ex");
  box.scrollTop = 0;
  const labels = { mc: ex.code ? "Lis le code" : "Choisis la bonne réponse", fill: "Complète le code", order: "Remets dans l'ordre", type: "Écris la réponse" };
  let h = `<span class="tag ${it.retry ? "retry" : ""}">${it.retry ? "↻ Erreur précédente" : labels[ex.t]}</span><h3>${esc(ex.q)}</h3>`;
  cur = { ready: false, item: it };
  const setReady = (v) => { cur.ready = v; btn.disabled = !v; };

  if (ex.t === "mc") {
    if (ex.code) h += `<pre class="code">${hl(ex.code)}</pre>`;
    const opts = shuffle(ex.a.map((text, k) => ({ text, ok: k === ex.c })));
    h += `<div class="choices">${opts.map((o, k) => `<button class="choice ${ex.mono || ex.code ? "mono" : ""}" data-k="${k}">${esc(o.text)}</button>`).join("")}</div>`;
    box.innerHTML = h;
    let sel = -1;
    $$(".choice", box).forEach(b => b.onclick = () => {
      if (cur.done) return;
      sel = +b.dataset.k; sfx.tap();
      $$(".choice", box).forEach(x => x.classList.toggle("sel", x === b)); setReady(true);
    });
    cur.check = () => {
      const good = opts[sel].ok;
      $$(".choice", box).forEach((x, k) => { x.classList.remove("sel"); if (opts[k].ok) x.classList.add("good"); else if (k === sel) x.classList.add("bad"); });
      return good;
    };
    cur.solution = ex.a[ex.c];
  }

  else if (ex.t === "fill") {
    const parts = ex.code.split("___");
    let code = hl(parts[0]);
    for (let k = 1; k < parts.length; k++) code += `<span class="blank" data-b="${k - 1}">&nbsp;</span>` + hl(parts[k]);
    const bank = shuffle(ex.bank.map((t, k) => ({ t, k })));
    h += `<pre class="code">${code}</pre><div class="bank">${bank.map(o => `<button class="tok" data-t="${o.k}">${esc(o.t)}</button>`).join("")}</div>`;
    box.innerHTML = h;
    const filled = Array(parts.length - 1).fill(null); // index dans ex.bank
    const blanks = $$(".blank", box);
    const paint = () => {
      blanks.forEach((b, k) => { b.classList.toggle("filled", filled[k] !== null); b.textContent = filled[k] !== null ? ex.bank[filled[k]] : " "; });
      $$(".tok", box).forEach(t => t.classList.toggle("used", filled.includes(+t.dataset.t)));
      setReady(filled.every(v => v !== null));
    };
    $$(".tok", box).forEach(t => t.onclick = () => {
      if (cur.done) return;
      const slot = filled.indexOf(null); if (slot < 0) return;
      filled[slot] = +t.dataset.t; sfx.tap(); paint();
    });
    blanks.forEach((b, k) => b.onclick = () => { if (cur.done || filled[k] === null) return; filled[k] = null; sfx.tap(); paint(); });
    cur.check = () => filled.every((v, k) => ex.bank[v] === ex.ans[k]);
    let sol = parts[0]; ex.ans.forEach((a, k) => sol += a + parts[k + 1]);
    cur.solution = sol;
  }

  else if (ex.t === "order") {
    let order = shuffle(ex.lines.map((_, k) => k));
    let tries = 0;
    while (order.every((v, k) => v === k) && tries++ < 10) order = shuffle(order);
    h += `<div class="answer-zone" id="az"></div><div class="pool" id="pool"></div>`;
    box.innerHTML = h;
    const picked = [];
    const paint = () => {
      $("#az").innerHTML = picked.map(k => `<button class="tok" data-k="${k}">${hl(ex.lines[k])}</button>`).join("");
      $("#pool").innerHTML = order.filter(k => !picked.includes(k)).map(k => `<button class="tok" data-k="${k}">${hl(ex.lines[k])}</button>`).join("");
      setReady(picked.length === ex.lines.length);
    };
    box.onclick = (e) => {
      const t = e.target.closest(".tok"); if (!t || cur.done) return;
      const k = +t.dataset.k, inAz = t.parentElement.id === "az";
      if (inAz) picked.splice(picked.indexOf(k), 1); else picked.push(k);
      sfx.tap(); paint();
    };
    paint();
    cur.check = () => picked.every((v, k) => ex.lines[v] === ex.lines[k]);
    cur.solution = ex.lines.join("\n");
  }

  else if (ex.t === "type") {
    if (ex.code) h += `<pre class="code">${hl(ex.code)}</pre>`;
    h += `<textarea class="type" id="ta" rows="2" placeholder="Tape ta réponse…" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"></textarea>`;
    if (ex.hint) h += `<div class="hint">💡 Indice : <code>${esc(ex.hint)}</code></div>`;
    box.innerHTML = h;
    const ta = $("#ta");
    ta.oninput = () => setReady(ta.value.trim().length > 0);
    ta.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); if (cur.ready) $("#check").click(); } };
    cur.check = () => { ta.readOnly = true; ta.blur(); return ex.ans.some(a => norm(a) === norm(ta.value)); };
    cur.solution = ex.ans[0];
  }
  if (ex.t !== "order") box.onclick = null;
}

$("#check").addEventListener("click", () => {
  if (!cur) return;
  if (cur.done) { // bouton « Continuer »
    if (!L.practice && S.hearts <= 0) { L = null; noHearts(); return; }
    nextExercise(); return;
  }
  if (!cur.ready) return;
  cur.done = true;
  const it = L.queue.shift();
  const good = cur.check();
  S.answered++;
  const foot = $("#footer"), btn = $("#check");
  if (good) {
    S.correct++; L.ok++;
    if (!it.retry) L.firstTry++;
    if (L.practice) delete S.weak[it.key];
    sfx.good(); vibrate(15);
    const cheers = ["Bravo !", "Excellent !", "Parfait !", "Bien joué !", "Super !", "Exactement !"];
    $("#fb").innerHTML = `<b>✅ ${cheers[Math.random() * cheers.length | 0]}</b>` + (it.ex.why ? `<div class="why">${esc(it.ex.why)}</div>` : "");
    foot.className = "footer good"; btn.className = "btn green";
  } else {
    L.mistakes++;
    S.weak[it.key] = 1;
    L.queue.push({ ...it, retry: true }); // on la reverra en fin de leçon
    if (!L.practice) { S.hearts = Math.max(0, S.hearts - 1); if (S.hearts < MAX_HEARTS && S.hearts === MAX_HEARTS - 1) S.heartTs = Date.now(); }
    $("#ls-hearts").textContent = L.practice ? "❤️ ∞" : `❤️ ${S.hearts}`;
    sfx.bad(); vibrate([40, 40, 40]);
    $("#ex").classList.remove("shake"); void $("#ex").offsetWidth; $("#ex").classList.add("shake");
    $("#fb").innerHTML = `<b>❌ Pas tout à fait…</b><div style="font-weight:800;font-size:13px;margin-bottom:2px">Bonne réponse :</div><div class="sol">${esc(cur.solution)}</div>` + (it.ex.why ? `<div class="why">${esc(it.ex.why)}</div>` : "");
    foot.className = "footer bad"; btn.className = "btn red";
  }
  $("#prog").style.width = `${L.ok / L.total * 100}%`;
  btn.textContent = "Continuer"; btn.disabled = false;
  save();
});

$("#quit").onclick = () => {
  openSheet(`<h2>Quitter la leçon ?</h2><p style="margin:0;font-weight:600;color:var(--muted)">Tu perdras ta progression dans cette leçon.</p>
    <button class="btn" id="stay">Continuer la leçon</button><button class="btn ghost" id="leave" style="margin-top:10px;color:var(--red)">Quitter</button>`);
  $("#stay").onclick = closeSheet;
  $("#leave").onclick = () => { closeSheet(); L = null; show("s-home"); renderAll(); };
};

function finishLesson() {
  const secs = Math.round((Date.now() - L.start) / 1000);
  const perfect = L.mistakes === 0;
  const acc = Math.round(L.firstTry / L.total * 100);
  const xp = L.total * 2 + (perfect ? 5 : 0) + (L.practice ? 0 : 5);
  S.xp += xp; S.daily.xp += xp;
  const today = dayStr();
  const y = new Date(); y.setDate(y.getDate() - 1);
  let streakUp = false;
  if (S.lastDay !== today) { S.streak = S.lastDay === dayStr(y) ? S.streak + 1 : 1; S.lastDay = today; streakUp = true; }
  S.best = Math.max(S.best, S.streak);
  if (!S.days.includes(today)) S.days = [...S.days, today].slice(-60);
  let extra = "";
  if (L.opt.type === "node") {
    const nd = NODES[L.opt.g];
    const first = !S.done[nd.key];
    S.done[nd.key] = true;
    if (first && nd.ni === 2) extra = `<p>🏆 Unité « ${COURSE[nd.ui].title} » terminée !</p>`;
  } else if (S.hearts < MAX_HEARTS) { S.hearts++; extra = `<p>❤️ +1 cœur récupéré</p>`; }
  if (user) S.pendingXp = (S.pendingXp || 0) + xp;
  save();
  syncNow();
  const goalJustDone = S.daily.xp >= DAILY_GOAL && S.daily.xp - xp < DAILY_GOAL;
  const titles = perfect ? ["Leçon parfaite !", "Sans faute !"] : ["Leçon terminée !", "Bien joué !"];
  $("#result").innerHTML = `
    <svg viewBox="0 0 100 100" class="mascot-big">${mascot()}</svg>
    <h1>${titles[Math.random() * 2 | 0]}</h1>
    ${streakUp ? `<p>🔥 Série : ${S.streak} jour${S.streak > 1 ? "s" : ""} !</p>` : ""}
    ${goalJustDone ? `<p>🎯 Objectif du jour atteint !</p>` : ""}
    ${extra}
    <div class="cards">
      <div class="rc" style="--c:#eab308"><small>XP gagnés</small><div>⭐ ${xp}</div></div>
      <div class="rc" style="--c:#22c55e"><small>Précision</small><div>🎯 ${acc}%</div></div>
      <div class="rc" style="--c:#3b82f6"><small>Temps</small><div>⏱ ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</div></div>
    </div>
    <div class="result-actions"><button class="btn green" id="res-ok">Continuer</button></div>`;
  L = null;
  show("s-result");
  sfx.win(); vibrate([30, 50, 30]);
  confetti();
  $("#res-ok").onclick = () => { show("s-home"); tab = "path"; renderAll(); const c = $(".node.current"); if (c) c.scrollIntoView({ block: "center", behavior: "smooth" }); };
}

/* ---------------- confettis ---------------- */
function confetti() {
  const cv = $("#confetti"), ctx = cv.getContext("2d"), app = $("#app");
  const W = cv.width = app.clientWidth, H = cv.height = app.clientHeight;
  const cols = ["#2563eb", "#facc15", "#22c55e", "#ef4444", "#a855f7", "#06b6d4"];
  const P = Array.from({ length: 120 }, () => ({ x: W / 2, y: H * 0.35, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: cols[Math.random() * cols.length | 0], a: Math.random() * 6, va: (Math.random() - .5) * .4 }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    P.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (++f < 150) requestAnimationFrame(tick); else ctx.clearRect(0, 0, W, H);
  })();
}

/* ---------------- démarrage ---------------- */
renderAll();
(async () => {
  try {
    await loadAccount();
    if (user) { await pullProgress(false); if (!profile) pseudoSheet(); await flushXp(); if (!L) renderAll(); }
  } catch {}
})();
setTimeout(() => { const c = $(".node.current"); if (c && currentNode() > 2) c.scrollIntoView({ block: "center" }); }, 50);
setInterval(() => { if ($("#s-home").classList.contains("on")) { refreshTime(); renderStats(); } }, 60000);
document.addEventListener("visibilitychange", () => { if (!document.hidden && $("#s-home").classList.contains("on")) renderAll(); });
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();

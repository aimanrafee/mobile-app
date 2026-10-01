/** features/ilmu.js — Skrin Rujukan Ilmu (tafsir, asbab, adab, qiraat, tarannum, tajwid)
 *
 *  Data: data/ilmu/*.json (disalin dari Source/Al-Quran, ~60KB jumlah).
 *  Fetch lazy sekali (selari), cache memori. Corak sama seperti quran.js Batch B.
 */
import { emitLog } from '../platform/core.js';
import { $, esc } from '../platform/ui.js';
import { view, render } from '../platform/router.js';

const TOPICS = [
  { id: 'tafsir', file: 'tafsir.json', name: { my: 'Tafsir', en: 'Tafsir' } },
  { id: 'asbab', file: 'asbab_nuzul.json', name: { my: 'Asbab Nuzul', en: 'Asbab Nuzul' } },
  { id: 'adab', file: 'adab_tilawah.json', name: { my: 'Adab Tilawah', en: 'Tilawah Etiquette' } },
  { id: 'qiraat', file: 'qiraat.json', name: { my: 'Qiraat', en: 'Qiraat' } },
  { id: 'tarannum', file: 'maqamat.json', name: { my: 'Tarannum', en: 'Tarannum' } },
  { id: 'makhraj', file: 'makhraj.json', name: { my: 'Makhraj', en: 'Makhraj' } },
  { id: 'sifat', file: 'sifat.json', name: { my: 'Sifat Huruf', en: 'Letter Attributes' } },
  { id: 'waqaf', file: 'waqaf.json', name: { my: 'Waqaf', en: 'Waqf' } },
];

let DATA = null, inflight = null, ilmuError = '';
const langIsEn = () => { try { return document.documentElement.lang === 'en'; } catch (e) { return false; } };

export function ensureIlmu() {
  if (DATA) return Promise.resolve(DATA);
  if (!inflight) {
    inflight = Promise.all(TOPICS.map((t) =>
      fetch('data/ilmu/' + t.file).then((r) => {
        if (!r.ok) throw new Error(t.file + ': HTTP ' + r.status);
        return r.json();
      })
    )).then((arr) => {
      DATA = Object.fromEntries(TOPICS.map((t, i) => [t.id, arr[i]]));
      inflight = null; ilmuError = '';
      render(true); return DATA;
    }).catch((e) => {
      inflight = null; ilmuError = e.message;
      emitLog('error', 'Ilmu gagal dimuat: ' + e.message);
      render(true); return null;
    });
  }
  return inflight;
}

/* ---------- per-topik ---------- */
const card = (head, body) => `<div class="card dua-card"><b>${head}</b>${body}</div>`;
const para = (t) => t ? `<div class="my">${esc(t)}</div>` : '';
const ar = (t) => t ? `<div class="ar" lang="ar">${esc(t)}</div>` : '';

function rTafsir(d) {
  return para(d.penerangan) + (d.kategori || []).map((k) =>
    `<div class="sec-title"><h2>${esc(k.nama)}</h2></div>` + para(k.penerangan) +
    (k.senarai || []).map((s) => card(esc(s.nama),
      ar(s.nama_arab) + `<div class="my">${esc(s.penulis || '')}${s.tahun ? ' · ' + esc(String(s.tahun)) : ''}</div>` +
      para(s.penerangan || s.nota || ''))).join('')
  ).join('');
}

function rAsbab(d) {
  return para(d.penerangan) + (d.peringatan ? `<div class="card form-card"><div class="cap muted">${esc(d.peringatan)}</div></div>` : '') +
    (d.asbab || []).map((a) => card(`${esc(a.tajuk)}${a.surah ? ' · Surah ' + a.surah : ''}`,
      para(a.teks) + (a.sumber ? `<div class="cap muted">${esc(a.sumber)}</div>` : ''))).join('');
}

function rAdab(d) {
  const dk = d.doa_khatam || {};
  return para(d.penerangan) +
    (d.kategori || []).map((k) => `<div class="sec-title"><h2>${esc(k.nama)}</h2></div>` + para(k.penerangan) +
      (k.senarai || []).map((s) => card(esc(s.tajuk), para(s.teks))).join('')).join('') +
    (dk.tajuk ? `<div class="sec-title"><h2>${esc(dk.tajuk)}</h2></div>` +
      `<div class="card dua-card">${ar(dk.lafaz_arab)}${dk.transliterasi ? `<div class="my"><i>${esc(dk.transliterasi)}</i></div>` : ''}${para(dk.makna)}${dk.sumber ? `<div class="cap muted">${esc(dk.sumber)}</div>` : ''}</div>` : '');
}

function rQiraat(d) {
  const imam = (m) => card(`${esc(m.imam || '')} — ${esc(m.nama_penuh || '')}`,
    `<div class="my">${esc(m.negeri || '')}${m.tahun_wafat ? ' · w. ' + esc(String(m.tahun_wafat)) : ''}</div>` +
    para(m.ciri) + (m.perawi ? `<div class="cap muted">${esc(m.perawi)}</div>` : ''));
  return para(d.penerangan) +
    ((d.konsep_utama || []).map((t) => `<div class="card dua-card"><div class="my">${esc(t)}</div></div>`).join('')) +
    `<div class="sec-title"><h2>Qiraat Tujuh</h2></div>` + (d.qiraat_tujuh || []).map(imam).join('') +
    `<div class="sec-title"><h2>+3 (Sepuluh)</h2></div>` + (d.qiraat_sepuluh_tambahan || []).map(imam).join('') +
    ((d.peringkat_qiraat || []).map((p) => card(esc(p.peringkat), para(p.keterangan))).join(''));
}

function rMaqam(d) {
  return para(d.penerangan) +
    ((d.konsep_utama || []).map((t) => `<div class="card dua-card"><div class="my">${esc(t)}</div></div>`).join('')) +
    (d.maqamat_utama || []).map((m) => card(`${m.no}. ${esc(m.nama)}${m.ejaan_lain ? ` <span class="cap muted">(${esc(m.ejaan_lain)})</span>` : ''}`,
      `<div class="my"><b>${esc(m.watak || '')}</b></div>` + para(m.gaya) + (m.contoh_penggunaan ? `<div class="cap muted">${esc(m.contoh_penggunaan)}</div>` : ''))).join('') +
    ((d.qari_rujukan || []).length ? `<div class="sec-title"><h2>Qari Rujukan</h2></div><div class="dua-cats">${d.qari_rujukan.map((q) => `<span class="chip">${esc(q)}</span>`).join('')}</div>` : '');
}

function rMakhraj(d) {
  return para(d.penerangan) +
    ((d.umum || []).map((m) => card(esc(m.nama),
      `<div class="my">${esc(m.melayu || '')}</div>` + ar(m.huruf))).join('')) +
    ((d.khusus || []).map((m) => card(`${m.no}. ${esc(m.nama)}`,
      `<div class="my">${esc(m.melayu || '')}</div>` + ar(m.huruf) + para(m.penerangan))).join(''));
}

function rSifat(d) {
  return para(d.penerangan) +
    ((d.berlawanan || []).map((m) => card(`${esc(m.nama)} ↔ ${esc(m.lawan || '')}`,
      ar(m.huruf) + para(m.penerangan))).join('')) +
    ((d.tunggal || []).map((m) => card(esc(m.nama), ar(m.huruf) + para(m.penerangan))).join('')) +
    `<div class="sec-title"><h2>28 Huruf</h2></div><div class="card dua-card">` +
    ((d.huruf || []).map((m) => `<div class="my"><b lang="ar">${esc(m.huruf)}</b> ${esc(m.nama)} <span class="cap muted">· ${(m.sifat || []).map(esc).join(', ')}</span></div>`).join('')) + `</div>`;
}

function rWaqaf(d) {
  return para(d.penerangan) +
    ((d.jenis || []).map((m) => card(esc(m.nama), para(m.penerangan))).join('')) +
    ((d.tanda || []).map((m) => card(`<span lang="ar" style="font-size:1.4rem">${esc(m.tanda)}</span> ${esc(m.nama)}`, para(m.penerangan))).join('')) +
    ((d.ibtida || []).map((m) => card(esc(m.tajuk), para(m.teks))).join(''));
}

const RENDERERS = { tafsir: rTafsir, asbab: rAsbab, adab: rAdab, qiraat: rQiraat, tarannum: rMaqam, makhraj: rMakhraj, sifat: rSifat, waqaf: rWaqaf };

/* ---------- skrin ---------- */
export function renderIlmu() {
  const topic = view.params.ilmuTopic || 'tafsir';
  const chips = TOPICS.map((t) =>
    `<button type="button" class="chip${t.id === topic ? ' on' : ''}" data-action="ilmu:topic" data-topic="${t.id}">${esc(langIsEn() ? t.name.en : t.name.my)}</button>`).join('');
  let body;
  if (DATA && DATA[topic]) {
    body = (RENDERERS[topic] || (() => ''))(DATA[topic]);
  } else {
    body = `<div>${'<div class="skel"></div>'.repeat(4)}</div>` +
      (ilmuError ? `<div class="card form-card load-err">
        <p class="muted">Gagal memuatkan rujukan. (${esc(ilmuError)})</p>
        <button type="button" class="btn gold" data-action="ilmu:retry">Cuba semula</button>
      </div>` : '');
  }
  return `<div class="home-head"><p class="kicker">Ilmu</p></div>
  <div class="dua-cats">${chips}</div>
  ${body}`;
}

export const ilmuActions = {
  'ilmu:topic': (el) => { view.params.ilmuTopic = el.dataset.topic; render(true); },
  'ilmu:retry': () => { ilmuError = ''; ensureIlmu(); render(true); },
};

export function ilmuOnShow(v) {
  if (v.screen === 'ilmu') ensureIlmu();
}

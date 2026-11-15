/* =====================================================================
   PARTIES 1A, 1B, 2A, 2B, 2C et écran de fin
   ===================================================================== */

/* Adresse ou lien affiché sur une carte 1A (pour l'export) */
function adresseCarte(c) {
  if (c.type === 'recherche') return c.adresse;
  if (c.type === 'flyer') return c.lien;
  const m = String(c.texte).match(/[a-z0-9.-]+\.[a-z]{2,}(\/[\w-]*)?/i);
  return m ? m[0] : '';
}

/* Souligne les adresses dans un texte (non cliquables) */
function soulignerLiens(t) { return h(t).replace(/((?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:fr|com|net|info|ly|gouv\.fr)(?:\/[\w-]+)?)/gi, '<u>$1</u>'); }

function maquette(c) {
  const sbar = `<div class="sbar"><span>${h(c.heure || '14:27')}</span><span>📶 4G ▮▮▮</span></div>`;
  switch (c.type) {
    case 'recherche':
      return `<div class="mk-search"><div class="bar"><span class="lg">Trouvo</span><span class="q">${h(c.requete || '')}</span><span>🔍</span></div><div class="r">
        ${c.sponsorise ? '<div class="spons">Sponsorisé</div>' : ''}
        <div class="site"><span class="f" style="background:${c.couleur}">${h(c.favicon)}</span><span><span class="nm">${h(c.nomSite)}</span><br><span class="u">https://${h(c.adresse)}</span></span></div>
        <h3>${h(c.titre)}</h3><p>${h(c.texte)}</p></div></div>`;
    case 'sms':
      return `<div class="mk-phone"><div class="scr">${sbar}<div class="who"><div class="av">👤</div>${h(c.expediteur)}</div>
        <div class="tm">Aujourd'hui ${h(c.heure)}</div><div class="bub">${soulignerLiens(c.texte)}</div></div></div>`;
    case 'reseau':
      return `<div class="mk-post"><div class="grp">👥 Publication dans le groupe <b>${h(c.groupe)}</b></div>
        <div class="hd"><span class="av">${h(c.auteur[0])}</span><span><b>${h(c.auteur)}</b><small>${h(c.quand)} · 🌐</small></span></div>
        <div class="tx">${soulignerLiens(c.texte)}</div><div class="ft"><span>👍 ❤️ ${h(c.reactions)}</span></div></div>`;
    case 'story':
      return `<div class="mk-phone mk-story"><div class="scr"><div class="prog"><i></i></div>
        <div class="acc"><span class="av">B</span><span>${h(c.compte)} <small>${h(c.quand)}</small></span></div>
        <div class="big">${h(c.texte.split('👉')[0])}</div><div class="lnk">🔗 ${h((c.texte.split('👉')[1] || '').trim())}</div></div></div>`;
    case 'ia':
      return `<div class="mk-ia"><div class="hd"><i></i>Assistant IA</div><div class="u">${h(c.question)}</div>
        <div class="a"><i></i><span>${h(c.texte)}</span></div></div>`;
    case 'flyer':
      return `<div class="mk-flyer"><div style="font-size:11px;color:#777;margin-bottom:6px">Papier trouvé dans la boîte aux lettres</div><h4>${h(c.titre)}</h4><p>${h(c.texte)}</p><div class="qr"></div><div class="lnk">${h(c.lien)}</div></div>`;
  }
  return '';
}

/* ---------- 1A ---------- */
RENDUS['1A'] = main => {
  const v = V(), R = E.reponses['1A'];
  main.innerHTML = `<div class="page"><h1>Site officiel ou site à éviter ?</h1>
    <div class="consigne">Pour chaque document, choisissez <b>Site officiel</b> ou <b>Site à éviter</b>. Puis expliquez en une phrase <b>quel indice</b> vous a permis de décider. Les liens ne sont pas cliquables.</div>
    <div id="cartes"></div></div>`;
  const zone = $('#cartes', main);
  E.ordres['1A'].forEach((id, i) => {
    const c = v.cartes1A.find(x => x.id === id); if (!R[id]) R[id] = { choix: null, justification: '' };
    const d = document.createElement('div'); d.className = 'c1a';
    d.innerHTML = `<div><div class="num">Document ${i + 1} / ${v.cartes1A.length}</div><div class="mock">${maquette(c)}</div></div>
      <div class="ans"><div class="choice2"><button data-c="officiel">Site officiel</button><button data-c="a-eviter">Site à éviter</button></div>
      <label class="q" style="margin:6px 0 0">Pourquoi ? (une phrase)</label><input class="txt" maxlength="300"></div>`;
    const btns = $$('[data-c]', d);
    const maj = () => btns.forEach(b => b.classList.toggle('on', R[id].choix === b.dataset.c));
    btns.forEach(b => b.onclick = () => { R[id].choix = b.dataset.c; maj(); sauver(); });
    maj();
    lier($('input', d), () => R[id].justification, x => R[id].justification = x);
    zone.appendChild(d);
  });
  footbar('', null, () => E.ordres['1A'].reduce((n, id) => n + (!R[id].choix ? 1 : 0) + (!R[id].justification.trim() ? 1 : 0), 0));
};

/* ---------- 1B ---------- */
RENDUS['1B'] = main => {
  const v = V(), R = E.reponses['1B'], S1 = v.situations1B;
  const trois = (k, titre, phrase) => `<div class="sit"><h2>${titre}</h2><div class="dit"><span class="av">🧓</span><span>« ${h(phrase)} »</span></div>
      <label class="q">1. Ce que je lui dis tout de suite</label><textarea rows="2" data-k="${k}.dire"></textarea>
      <label class="q">2. Les questions que je lui pose (au moins deux)</label><textarea rows="3" data-k="${k}.questions"></textarea>
      <label class="q">3. Ce qu'on fait ensuite, selon ses réponses</label><textarea rows="3" data-k="${k}.ensuite"></textarea></div>`;
  main.innerHTML = `<div class="page"><h1>Que dire à la personne ?</h1>
    <div class="consigne">Vous accompagnez une personne qui vous dit ceci. Pour les situations 1 et 2, <b>répondez en trois temps</b>. Pour la question flash, une ligne suffit.</div>
    ${trois('s1', 'Situation 1', S1.s1)}
    <div class="sit"><h2>Question flash</h2><div class="dit"><span class="av">🧓</span><span>« ${h(S1.flash)} »</span></div>
      <label class="q">Ma réponse</label><input class="txt" data-k="flash" maxlength="300"></div>
    ${trois('s3', 'Situation 2', S1.s3)}</div>`;
  $$('[data-k]', main).forEach(el => {
    const [a, b] = el.dataset.k.split('.');
    lier(el, () => b ? R[a][b] : R[a], x => { if (b) R[a][b] = x; else R[a] = x; });
  });
  footbar('', null, () => $$('[data-k]', main).filter(el => !el.value.trim()).length);
};

/* ---------- 2A ---------- */
RENDUS['2A'] = main => {
  const R = E.reponses['2A'];
  if (!R.classement) R.classement = E.ordres['2A'].slice();
  main.innerHTML = `<div class="page"><h1>Gérer ses mots de passe</h1>
    <div class="consigne">Classez ces six façons de gérer ses mots de passe, <b>de la meilleure (en haut) à la pire (en bas)</b>, avec les flèches ↑ ↓.</div>
    <div class="rank lab">▲ La meilleure</div><ol class="rank" id="rank"></ol><div class="rank lab">▼ La pire</div>
    <label class="q" style="margin-top:20px">Pourquoi utiliser le même mot de passe partout est-il dangereux ?</label><textarea rows="3" id="j2a"></textarea></div>`;
  const ol = $('#rank', main);
  const draw = moved => {
    ol.innerHTML = R.classement.map((id, i) => `<li class="${id === moved ? 'moved' : ''}"><span class="n">${i + 1}</span><span>${h(CONFIG.motsDePasse.find(m => m.id === id).texte)}</span>
      <span class="arr"><button data-u="${i}" ${i === 0 ? 'disabled' : ''} title="Monter">↑</button><button data-d="${i}" ${i === R.classement.length - 1 ? 'disabled' : ''} title="Descendre">↓</button></span></li>`).join('');
  };
  ol.onclick = e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const i = +(b.dataset.u ?? b.dataset.d), j = b.dataset.u != null ? i - 1 : i + 1;
    const a = R.classement; [a[i], a[j]] = [a[j], a[i]]; R.modifie = true; sauver(); draw(a[j]);
  };
  draw();
  lier($('#j2a', main), () => R.justification, x => R.justification = x);
  footbar('', null, () => (R.justification.trim() ? 0 : 1) + (R.modifie ? 0 : 1));
};

/* ---------- 2B ---------- */
RENDUS['2B'] = main => {
  main.innerHTML = `<div class="page"><h1>La double authentification</h1>
    <div class="consigne">Expliquez <b>avec vos mots</b> ce qu'est la double authentification, et <b>donnez un exemple</b>.</div>
    <textarea rows="7" id="t2b"></textarea></div>`;
  lier($('#t2b', main), () => E.reponses['2B'], x => E.reponses['2B'] = x);
  footbar('Après validation, vous ne pourrez plus modifier cette définition.', null, () => E.reponses['2B'].trim() ? 0 : 1);
};

/* ---------- 2C ---------- */
RENDUS['2C'] = main => {
  const v = V(), R = E.reponses['2C'];
  main.innerHTML = `<div class="page"><h1>Est-ce de la double authentification ?</h1>
    <div class="consigne">Pour chaque situation, répondez <b>Oui</b> ou <b>Non</b>. Pour les situations marquées <span style="color:#c58a00;font-weight:700">★</span>, expliquez aussi pourquoi.</div><div id="yn"></div></div>`;
  const zone = $('#yn', main);
  E.ordres['2C'].forEach((id, i) => {
    const s = v.situations2C.find(x => x.id === id); if (!R[id]) R[id] = { reponse: null, justification: '' };
    const d = document.createElement('div'); d.className = 'yn';
    d.innerHTML = `<div class="row"><span><b>${i + 1}.</b> ${s.etoile ? '<span class="star">★</span> ' : ''}${h(s.texte)}</span>
      <div class="choice2"><button data-c="oui">Oui</button><button data-c="non">Non</button></div></div>
      ${s.etoile ? '<input class="txt" placeholder="Pourquoi ?" maxlength="300">' : ''}`;
    const btns = $$('[data-c]', d), maj = () => btns.forEach(b => b.classList.toggle('on', R[id].reponse === b.dataset.c));
    btns.forEach(b => b.onclick = () => { R[id].reponse = b.dataset.c; maj(); sauver(); }); maj();
    if (s.etoile) lier($('input', d), () => R[id].justification, x => R[id].justification = x);
    zone.appendChild(d);
  });
  footbar('', null, () => E.ordres['2C'].reduce((n, id) => { const s = v.situations2C.find(x => x.id === id);
    return n + (R[id].reponse ? 0 : 1) + (s.etoile && !R[id].justification.trim() ? 1 : 0); }, 0));
};

/* ---------- Fin ---------- */
RENDUS.fin = main => {
  if (!E.fin) { E.fin = new Date().toISOString(); sauver(); }
  main.innerHTML = `<div class="endbox"><h1>Évaluation terminée</h1>
    <p>Il reste à enregistrer votre copie.</p>
    <p><b>Enregistrez le fichier avec le nom donné par le professeur, dans le dossier commun.</b></p>
    <button class="btn big" id="btnexport">Exporter ma copie</button>
    <div id="apres"></div>
    <p style="font-size:12px;color:#888;margin-top:18px">Copie n° ${h(E.idCopie)} — variante ${h(E.variante)}</p></div>`;
  const apres = $('#apres', main);
  const montrerTerminer = () => {
    apres.innerHTML = `<div class="ok">✓ Copie enregistrée.</div><p style="font-size:13px;color:#555">Si vous n'avez pas choisi le bon dossier ou le bon nom, cliquez encore sur « Exporter ma copie ».<br>Quand c'est bon, cliquez sur « Terminer ».</p>
      <button class="btn ghost" id="btnterminer">Terminer</button>`;
    $('#btnterminer', apres).onclick = async () => {
      if (!await confirmer('Terminer ?', '<p>Votre copie a bien été enregistrée dans le dossier commun ?</p><p>Après « Terminer », elle sera effacée de cet ordinateur.</p>', 'Terminer', 'Pas encore')) return;
      effacerSauvegarde(); E = null; location.reload();
    };
  };
  $('#btnexport', main).onclick = async () => {
    const ok = await exporterCopie();
    if (ok) { E.exporte = true; sauver(); montrerTerminer(); }
  };
  if (E.exporte) montrerTerminer();
};

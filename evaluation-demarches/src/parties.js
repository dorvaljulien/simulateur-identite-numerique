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
      return `<div class="mk-search"><div class="bar"><span class="lg">${h(nom('trouvo'))}</span><span class="q">${h(c.requete || '')}</span><span>🔍</span></div><div class="r">
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
  ['s1', 's3'].forEach(k => { if (!Array.isArray(R[k].questions)) R[k].questions = [R[k].questions || '', '']; });
  const trois = (k, titre, phrase) => `<div class="sit"><h2>${titre}</h2><div class="dit"><span class="av">🧓</span><span>« ${h(phrase)} »</span></div>
      <label class="q">1. Ce que je lui dis tout de suite</label><textarea rows="2" data-k="${k}.dire"></textarea>
      <label class="q">2. Avant de la conseiller, il me manque des informations. Je lui pose deux questions :</label>
      <p class="aide-q">Écrivez les deux questions que vous posez à la personne, comme vous les diriez à voix haute.</p>
      <div class="qpair"><span>Question 1 :</span><input class="txt" data-k="${k}.questions.0" maxlength="200">
        <span>Question 2 :</span><input class="txt" data-k="${k}.questions.1" maxlength="200"></div>
      <label class="q">3. Ce qu'on fait ensuite, selon ses réponses</label><textarea rows="3" data-k="${k}.ensuite"></textarea></div>`;
  main.innerHTML = `<div class="page"><h1>Que dire à la personne ?</h1>
    <div class="consigne">Vous accompagnez une personne qui vous dit ceci. Pour les situations 1 et 2, <b>répondez en trois temps</b>. Pour la question flash, une ligne suffit.</div>
    ${trois('s1', 'Situation 1', S1.s1)}
    <div class="sit"><h2>Question flash</h2><div class="dit"><span class="av">🧓</span><span>« ${h(S1.flash)} »</span></div>
      <label class="q">Ma réponse</label><input class="txt" data-k="flash" maxlength="300"></div>
    ${trois('s3', 'Situation 2', S1.s3)}</div>`;
  $$('[data-k]', main).forEach(el => {
    const [a, b, c] = el.dataset.k.split('.');
    if (c != null) lier(el, () => R[a][b][c], x => { R[a][b][c] = x; });
    else lier(el, () => b ? R[a][b] : R[a], x => { if (b) R[a][b] = x; else R[a] = x; });
  });
  footbar('', null, () => $$('[data-k]', main).filter(el => !el.value.trim()).length);
};

/* ---------- 2A ---------- */
/* Lettre et couleur d'une proposition : fixées par l'ordre de départ (tiré au hasard), elles ne bougent pas pendant le classement */
function lettre2A(id) { return String.fromCharCode(65 + E.ordres['2A'].indexOf(id)); }
function couleur2A(id) { const c = CONFIG.couleursLettres2A; return c[E.ordres['2A'].indexOf(id) % c.length]; }

RENDUS['2A'] = main => {
  const R = E.reponses['2A'], n = CONFIG.motsDePasse.length;
  if (!R.classement) R.classement = E.ordres['2A'].slice();
  main.innerHTML = `<div class="page"><h1>Gérer ses mots de passe</h1>
    <div class="consigne">Voici ${n} façons de gérer ses mots de passe. <b>Rangez-les de la meilleure (en haut) à la pire (en bas).</b><br>
      Pour déplacer une étiquette : <b>cliquez dessus, gardez le bouton appuyé, faites-la glisser</b> à sa place, puis relâchez.</div>
    <div class="rank2"><div class="axe"><span class="top">▲<br>La meilleure</span><span class="mid">⋮</span><span class="bot">La pire<br>▼</span></div><ol class="rank" id="rank"></ol></div>
    <label class="q" style="margin-top:20px">Pourquoi utiliser le même mot de passe partout est-il dangereux ?</label><textarea rows="3" id="j2a"></textarea></div>`;
  const ol = $('#rank', main);
  const draw = moved => {
    ol.innerHTML = R.classement.map(id => { const c = couleur2A(id);
      return `<li data-id="${id}" class="${id === moved ? 'moved' : ''}" style="border-left-color:${c}"><span class="grip" aria-hidden="true">⋮⋮</span>
        <span class="lt" style="background:${c}">${lettre2A(id)}</span><span>${h(CONFIG.motsDePasse.find(m => m.id === id).texte)}</span></li>`; }).join('');
  };
  /* Glisser-déposer à la souris (événements pointer : marche aussi au doigt et au stylet) */
  let drag = null;
  ol.addEventListener('pointerdown', e => {
    const li = e.target.closest('li'); if (!li || e.button > 0) return;
    e.preventDefault();
    ol.setPointerCapture(e.pointerId);
    drag = { li, decalage: e.clientY - li.getBoundingClientRect().top, avant: R.classement.join() };
    li.classList.add('dragging');
  });
  ol.addEventListener('pointermove', e => {
    if (!drag) return;
    const li = drag.li, autres = $$('li', ol).filter(x => x !== li);
    let i = autres.findIndex(x => { const r = x.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
    const ref = i < 0 ? null : autres[i];
    if (li.nextElementSibling !== ref) ol.insertBefore(li, ref);
    li.style.transform = '';
    li.style.transform = `translateY(${e.clientY - drag.decalage - li.getBoundingClientRect().top}px)`;
  });
  const lacher = () => {
    if (!drag) return;
    const li = drag.li; li.style.transform = ''; li.classList.remove('dragging');
    R.classement = $$('li', ol).map(x => x.dataset.id);
    if (R.classement.join() !== drag.avant) { R.modifie = true; sauver(); draw(li.dataset.id); }
    drag = null;
  };
  ol.addEventListener('pointerup', lacher);
  ol.addEventListener('pointercancel', lacher);
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
    <div class="question-visible"><span class="qq">Question : dans chacune de ces situations, est-ce de la double authentification ?</span><br>
      Pour chaque ligne, cliquez sur <b>Oui</b> (c'est de la double authentification) ou sur <b>Non</b> (ce n'est pas de la double authentification).<br>
      Pour les situations marquées <span class="star" style="color:#c58a00;font-weight:700">★</span>, expliquez aussi pourquoi.</div>
    <div class="yn-head"><span>Pour chaque situation : est-ce de la double authentification ?</span><span>Oui ou Non</span></div><div id="yn"></div></div>`;
  const zone = $('#yn', main);
  E.ordres['2C'].forEach((id, i) => {
    const s = v.situations2C.find(x => x.id === id); if (!R[id]) R[id] = { reponse: null, justification: '' };
    const d = document.createElement('div'); d.className = 'yn';
    d.innerHTML = `<div class="row"><span><b>${i + 1}.</b> ${s.etoile ? '<span class="star">★</span> ' : ''}${h(s.texte)}</span>
      <div class="choice2"><button data-c="oui">Oui</button><button data-c="non">Non</button></div></div>
      ${s.etoile ? '<input class="txt" placeholder="★ Pourquoi est-ce (ou n\'est-ce pas) de la double authentification ?" maxlength="300">' : ''}`;
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

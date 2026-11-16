// Dessine les schémas du cours (PNG) à partir de HTML. Usage : node cours/build-images.js
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, 'images');
const base = `*{box-sizing:border-box}body{margin:0;font-family:Arial,Helvetica,sans-serif;color:#1d2b2e;background:#fff}
.key{display:inline-flex;align-items:center;gap:6px;border-radius:20px;padding:5px 12px 5px 8px;font-size:15px;font-weight:700;margin:4px 3px;white-space:nowrap}
.key i{font-style:normal;font-size:16px}
.pw{background:#fde9c8;border:2px solid #e08a00;color:#6b4200}.id{background:#d5efec;border:2px solid #0f7f78;color:#0a4a46}
.no{opacity:.45;text-decoration:line-through;filter:grayscale(1)}`;

const portes = `<style>${base}
#x{width:1100px;padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:18px}
.p{border-radius:14px;padding:16px 18px;border:3px solid}
.a{border-color:#e08a00;background:#fffaf0}.b{border-color:#0f5c63;background:#f1f9f8}
h3{margin:0 0 2px;font-size:24px}.a h3{color:#a35f00}.b h3{color:#0f5c63}
.sub{font-size:15px;margin-bottom:10px;color:#444}
.row{display:grid;grid-template-columns:1fr 120px;gap:12px;align-items:center}
.door{height:170px;border-radius:10px 10px 0 0;position:relative;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:15px;text-align:center;line-height:1.25}
.a .door{background:#e08a00}.b .door{background:#0f5c63;border:6px double #9fd3cf}
.door::after{content:"";position:absolute;right:12px;top:50%;width:13px;height:13px;border-radius:50%;background:#fff}
.lab{font-size:12.5px;color:#555;margin:6px 0 2px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}
.leg{grid-column:1/3;display:flex;gap:26px;justify-content:center;font-size:15px;padding-top:2px}
.leg span{display:flex;align-items:center;gap:8px}
</style><div id="x">
<div class="p a"><h3>FranceConnect : la porte</h3><div class="sub">6 clés l'ouvrent</div>
  <div class="row"><div>
    <div class="lab">Comptes à mot de passe</div>
    <span class="key pw"><i>🔑</i>impots.gouv.fr</span><span class="key pw"><i>🔑</i>ameli.fr</span><span class="key pw"><i>🔑</i>MSA</span>
    <div class="lab">Identités numériques</div>
    <span class="key id"><i>📱</i>L'Identité Numérique La Poste</span><span class="key id"><i>📱</i>France Identité</span><span class="key id"><i>📱</i>TrustMe</span>
  </div><div class="door">Sites<br>publics</div></div></div>
<div class="p b"><h3>FranceConnect+ : la porte blindée</h3><div class="sub">2 clés seulement</div>
  <div class="row"><div>
    <div class="lab">Refusés</div>
    <span class="key pw no"><i>🔑</i>impots.gouv.fr</span><span class="key pw no"><i>🔑</i>ameli.fr</span><span class="key pw no"><i>🔑</i>MSA</span><span class="key id no"><i>📱</i>TrustMe</span>
    <div class="lab">Acceptés : identité vérifiée</div>
    <span class="key id"><i>📱</i>L'Identité Numérique La Poste</span><span class="key id"><i>📱</i>France Identité</span>
  </div><div class="door">Argent<br>Santé<br>Vote</div></div></div>
<div class="leg"><span><span class="key pw"><i>🔑</i>mot de passe</span> prouve : « j'ai reçu un courrier »</span><span><span class="key id"><i>📱</i>identité vérifiée</span> prouve : « ma pièce d'identité a été contrôlée »</span></div>
</div>`;

const fauxMail = `<style>${base}
#x{width:760px;padding:12px 12px 12px 12px;position:relative}
.mail{border:1px solid #c9ced6;border-radius:8px;overflow:hidden;width:520px;font-size:14px}
.hd{background:#f3f5f8;padding:10px 14px;border-bottom:1px solid #dde1e7;line-height:1.5}
.hd b{font-size:16px}.from{color:#444;font-size:13px}
.bd{padding:14px}.logo{background:#1f4d3a;color:#fff;font-weight:700;padding:8px 12px;font-size:17px;font-family:Georgia,serif;margin-bottom:10px}
.btn{display:inline-block;background:#b3261e;color:#fff;font-weight:700;padding:9px 18px;border-radius:4px;margin:8px 0}
.url{font-size:12px;background:#eee;border:1px solid #ccc;padding:2px 8px;display:inline-block;color:#333}
.n{position:absolute;left:548px;width:205px;font-size:13.5px;line-height:1.3;border-left:4px solid #e08a00;padding:3px 0 3px 9px;color:#3a2a00;background:#fff8ea}
.n b{color:#a35f00}.fic{font-size:11.5px;color:#777;margin-top:6px}
u.h{background:#ffe08a;text-decoration:none;padding:0 2px}
</style><div id="x"><div class="mail"><div class="hd"><b>⚠ Votre compte sera suspendu sous <u class="h">24 h</u></b><br>
<span class="from">Service Sécurité Fiscalis &lt;securite@<u class="h">fiscalis-gouv-sim.com</u>&gt;</span></div>
<div class="bd"><div class="logo">Fiscalis</div>Madame, Monsieur,<br><br>Une activité inhabituelle a été détectée sur votre espace. Sans action de votre part, il sera <u class="h">suspendu sous 24 heures</u>.<br>
<span class="btn">Confirmer mes <u class="h" style="color:#000">identifiants</u></span><br><span class="url">http://fiscalis-gouv-sim.com/verification</span></div></div>
<div class="fic">Exemple fictif, tiré du simulateur. Le vrai site s'appelait fiscalis.gouv.sim.</div>
<div class="n" style="top:14px"><b>① L'urgence.</b> On me presse pour que je ne réfléchisse pas.</div>
<div class="n" style="top:68px"><b>② L'expéditeur.</b> Un tiret et « .com » : ce n'est pas l'adresse du vrai site.</div>
<div class="n" style="top:140px"><b>③ La demande.</b> Aucun site officiel ne demande un mot de passe par mail.</div>
<div class="n" style="top:212px"><b>④ Le lien.</b> Je passe la souris dessus sans cliquer : l'adresse s'affiche.</div>
</div>`;

const tel = `<style>${base}
#x{width:300px;padding:10px}
.ph{width:210px;margin:0 auto;background:#16171a;border-radius:28px;padding:11px}
.sc{background:#0c0e14;border-radius:19px;color:#fff;padding:16px 12px 16px;text-align:center}
.app{font-weight:700;font-size:15px;display:flex;gap:6px;justify-content:center;align-items:center;margin-bottom:10px}.app i{width:16px;height:16px;border-radius:4px;background:#00a3a5;display:inline-block}
.q{background:rgba(255,255,255,.1);border-radius:10px;padding:12px 8px;font-size:14.5px;line-height:1.4;margin-bottom:12px}
.b1,.b2{border-radius:16px;padding:9px;font-size:14px;margin-top:8px}.b1{background:rgba(255,255,255,.16)}.b2{background:#00a3a5;font-weight:700}
.cap{font-size:12.5px;color:#555;text-align:center;margin-top:8px;line-height:1.35}
</style><div id="x"><div class="ph"><div class="sc"><div class="app"><i></i>Identité numérique</div>
<div class="q">Demande de connexion à <b>Crédit Éclair</b>.<br>Est-ce bien vous ?</div><div class="b1">Non, refuser</div><div class="b2">Oui, c'est moi</div></div></div>
<div class="cap">Je n'ai rien demandé ?<br><b>Je refuse.</b></div></div>`;

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 1200, height: 900 } });
  for (const [name, html] of [['schema-portes', portes], ['faux-mail', fauxMail], ['telephone', tel]]) {
    await pg.setContent('<!doctype html><meta charset="utf-8">' + html);
    await (await pg.$('#x')).screenshot({ path: path.join(OUT, name + '.png') });
    console.log('OK', name);
  }
  await b.close();
})();

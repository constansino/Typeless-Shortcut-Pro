const fs = require('fs');
const path = 'resources/app/dist/renderer/static/js/index2.js';
const c = fs.readFileSync(path, 'utf8');
const old = 'Q=V.useCallback(b=>{if(b.length===0)return!1;if(b.every(a1=>/^[a-zA-Z0-9`]+$/.test(a1)&&a1.length===1))return q(a("client:shortcuts__set_shortcuts_input__error__alphanumeric_only")),!1;if(b.length>3)return q(a("client:shortcuts__set_shortcuts_input__error__too_many_keys")),!1;const i1=a1=>q2(a1).map(W1=>W1.trim().toLowerCase()).sort().join("+"),$1=kx(),P1=b.join("+").toLowerCase(),k=i1(P1);if($1.map(i1).includes(k))return q(a("client:shortcuts__set_shortcuts_input__error__system_reserved")),!1;const y1=b.filter(a1=>/^[a-zA-Z0-9]$/.test(a1));if(y1.length>=2){const a1=y1.filter(j1=>/^[a-zA-Z]$/.test(j1));if(a1.length>=2){const j1=a1.map(V1=>V1.toLowerCase()).sort();for(let V1=0;V1<j1.length-1;V1++)if(j1[V1+1].charCodeAt(0)-j1[V1].charCodeAt(0)===1)return q(a("client:shortcuts__set_shortcuts_input__error__consecutive_letters")),!1}const W1=y1.filter(j1=>/^[0-9]$/.test(j1));if(W1.length>=2){const j1=W1.map(V1=>parseInt(V1)).sort();for(let V1=0;V1<j1.length-1;V1++)if(j1[V1+1]-j1[V1]===1)return q(a("client:shortcuts__set_shortcuts_input__error__consecutive_numbers")),!1}}if(y){for(const[a1,W1]of Object.entries(y))if(a1!==s&&W1&&i1(W1)===k)return q(a("client:shortcuts__set_shortcuts_input__error__already_in_use")),!1}return F(),!0},[s,y,q,F,a])';
const nw = 'Q=V.useCallback(b=>{if(b.length===0)return!1;return F(),!0},[s,y,q,F,a])';
if (c.indexOf(old) === -1) {
    console.error('Pattern not found');
    process.exit(1);
}
const nc = c.replace(old, nw);
fs.writeFileSync(path, nc);
console.log('Successfully patched index2.js');

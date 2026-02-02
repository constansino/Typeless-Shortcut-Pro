const fs = require('fs');
const path = require('path');

// Allow user to pass path, or default to standard location
const targetPath = process.argv[2] || path.join(__dirname, '../resources/app/dist/renderer/static/js/index2.js');

if (!fs.existsSync(targetPath)) {
    console.error(`Target file not found at: ${targetPath}`);
    console.error("Please ensure you have unpacked the 'app.asar' to 'resources/app' or provide the path.");
    process.exit(1);
}

const content = fs.readFileSync(targetPath, 'utf8');

// The exact string to find. This relies on the specific build version of Typeless.
const originalCode = 'Q=V.useCallback(b=>{if(b.length===0)return!1;if(b.every(a1=>/^[a-zA-Z0-9`]+$/.test(a1)&&a1.length===1))return q(a("client:shortcuts__set_shortcuts_input__error__alphanumeric_only")),!1;if(b.length>3)return q(a("client:shortcuts__set_shortcuts_input__error__too_many_keys")),!1;const i1=a1=>q2(a1).map(W1=>W1.trim().toLowerCase()).sort().join("+"),$1=kx(),P1=b.join("+").toLowerCase(),k=i1(P1);if($1.map(i1).includes(k))return q(a("client:shortcuts__set_shortcuts_input__error__system_reserved")),!1;const y1=b.filter(a1=>/^[a-zA-Z0-9]$/.test(a1));if(y1.length>=2){const a1=y1.filter(j1=>/^[a-zA-Z]$/.test(j1));if(a1.length>=2){const j1=a1.map(V1=>V1.toLowerCase()).sort();for(let V1=0;V1<j1.length-1;V1++)if(j1[V1+1].charCodeAt(0)-j1[V1].charCodeAt(0)===1)return q(a("client:shortcuts__set_shortcuts_input__error__consecutive_letters")),!1}const W1=y1.filter(j1=>/^[0-9]$/.test(j1));if(W1.length>=2){const j1=W1.map(V1=>parseInt(V1)).sort();for(let V1=0;V1<j1.length-1;V1++)if(j1[V1+1]-j1[V1]===1)return q(a("client:shortcuts__set_shortcuts_input__error__consecutive_numbers")),!1}}if(y){for(const[a1,W1]of Object.entries(y))if(a1!==s&&W1&&i1(W1)===k)return q(a("client:shortcuts__set_shortcuts_input__error__already_in_use")),!1}return F(),!0},[s,y,q,F,a])';

const patchedCode = 'Q=V.useCallback(b=>{if(b.length===0)return!1;return F(),!0},[s,y,q,F,a])';

if (content.includes(patchedCode)) {
    console.log('✅ File is already patched.');
    process.exit(0);
}

if (!content.includes(originalCode)) {
    console.error('❌ Could not find the exact code pattern to replace.');
    console.error('The application version might differ, or the file is already modified.');
    console.error('Aborting patch to prevent corruption.');
    process.exit(1);
}

// Perform replacement
const newContent = content.replace(originalCode, patchedCode);

// Verification
if (newContent.length === content.length) {
    console.error('❌ Replace failed (length unchanged) despite finding the string. This is unexpected.');
    process.exit(1);
}

fs.writeFileSync(targetPath, newContent);
console.log('✅ Successfully patched index2.js');
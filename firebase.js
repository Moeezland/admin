import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
getFirestore, doc, getDoc, setDoc, updateDoc,
collection, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔑 YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyCYxZRvhGOSO6KntJKFB8cQdlE5a2XVAaQ",
  authDomain: "moeezland-id.firebaseapp.com",
  projectId: "moeezland-id",
  storageBucket: "moeezland-id.firebasestorage.app",
  messagingSenderId: "979635453691",
  appId: "1:979635453691:web:29d320a19c635972273a5e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔢 Generate Sequential Visa ID
async function generateVisaId(typeCode) {
const year = "26"; // you can auto-generate later
const counterRef = doc(db, "counters", `visa_${typeCode}_${year}`);

return await runTransaction(db, async (tx) => {
const snap = await tx.get(counterRef);

```
let next = 1;
if (snap.exists()) {
  next = snap.data().last + 1;
}

tx.set(counterRef, { last: next }, { merge: true });

const serial = String(next).padStart(6, "0");
return return `MOE${typeCode}${year}${serial}`;
```

});
}

// 🔢 Generate Civil ID
async function generateCivilId() {
const counterRef = doc(db, "counters", "civil_id");

return await runTransaction(db, async (tx) => {
const snap = await tx.get(counterRef);

```
let next = 1;
if (snap.exists()) {
  next = snap.data().last + 1;
}

tx.set(counterRef, { last: next }, { merge: true });

return "729" + String(next).padStart(7, "0");
```

});
}

// ✈️ ISSUE VISA
window.issueVisa = async () => {
const eBorder = document.getElementById("eborder").value;
const typeCode = document.getElementById("visaType").value;

const personRef = doc(db, "people", eBorder);
const personSnap = await getDoc(personRef);

if (!personSnap.exists()) {
alert("Person not found");
return;
}

const visaId = await generateVisaId(typeCode);

await setDoc(doc(db, "people", eBorder, "visas", visaId), {
type: typeCode,
category: "entry",
status: "active",
issued_at: serverTimestamp(),
expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
});

await updateDoc(personRef, {
civil_status: "visitor"
});

alert("Visa issued: " + visaId);
};

// 🪪 ISSUE CIVIL ID
window.issueCivilID = async () => {
const eBorder = document.getElementById("eborderCID").value;

const personRef = doc(db, "people", eBorder);
const personSnap = await getDoc(personRef);

if (!personSnap.exists()) {
alert("Person not found");
return;
}

const civilId = await generateCivilId();

await setDoc(doc(db, "people", eBorder, "civil_ids", civilId), {
issued_at: serverTimestamp(),
status: "active"
});

await updateDoc(personRef, {
civil_status: "resident"
});

alert("Civil ID issued: " + civilId);
};


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRNUAjtw4US05vfkhcJYtLWwMcw_sTLB0",
  authDomain: "susurrosdeeryndor.firebaseapp.com",
  databaseURL: "https://susurrosdeeryndor-default-rtdb.firebaseio.com",
  projectId: "susurrosdeeryndor",
  storageBucket: "susurrosdeeryndor.firebasestorage.app",
  messagingSenderId: "654804276821",
  appId: "1:654804276821:web:f112a52ca164237ca9e6dc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const container = document.getElementById("personajes-container");
const personajesRef = ref(db, 'personajes');

onValue(personajesRef, (snapshot) => {
  const data = snapshot.val();
  container.innerHTML = '';
  for (let key in data) {
    const pj = data[key];
    const div = document.createElement("div");
    div.className = "personaje";
    div.innerHTML = `
      <h2>${pj.nombre}</h2>
      <p><span class="titulo">Clase:</span> ${pj.clase} (Nivel ${pj.nivel})</p>
      <p><span class="titulo">Raza:</span> ${pj.raza}</p>
      <p><span class="titulo">HP:</span> ${pj.hp}</p>
      <p><span class="titulo">Estado:</span> ${pj.estado}</p>
      <p><span class="titulo">Efectos:</span> ${pj.efectos?.join(", ")}</p>
      <p><span class="titulo">Equipo:</span> ${pj.equipo?.join(", ")}</p>
    `;
    container.appendChild(div);
  }
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEaZwsIA-Dm6M8wTN67ebyLHA6bRYICuI",
  authDomain: "mundo-de-rol.firebaseapp.com",
  databaseURL: "https://mundo-de-rol-default-rtdb.firebaseio.com",
  projectId: "mundo-de-rol",
  storageBucket: "mundo-de-rol.firebasestorage.app",
  messagingSenderId: "90664853839",
  appId: "1:90664853839:web:ddb31bee20b6077842a53a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("Bot Narrador v3.0 con lógica flexible iniciado.");

function log(msg) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += "<p>> " + msg + "</p>";
  logDiv.scrollTop = logDiv.scrollHeight;
}

window.procesarComando = function () {
  const entrada = document.getElementById("comando").value.trim();
  if (!entrada) return;
  interpretarEntrada(entrada);
  document.getElementById("comando").value = "";
}

function interpretarEntrada(texto) {
  const t = texto.toLowerCase();

  // Registro de narrativa pura
  if (t.includes("susurra") || t.includes("profecía") || t.includes("sueño") || t.includes("leyenda") || t.includes("se dice que")) {
    const refHist = ref(db, 'historia');
    push(refHist, { tipo: "narracion", contenido: texto });
    return log("Narración simbólica registrada.");
  }

  // Registro de acción con personaje
  if (t.includes("kaelen") || t.includes("rhogar") || t.includes("jorge") || t.includes("soria") || t.includes("lewys") || t.includes("vaelen")) {
    const nombre = ["kaelen", "rhogar", "jorge", "soria", "lewys", "vaelen"].find(n => t.includes(n));
    const refHist = ref(db, 'historia');
    push(refHist, { tipo: "accion", personaje: nombre, contenido: texto });
    return log(`Acción registrada para '${nombre}'.`);
  }

  // Registro de lugar
  if (t.includes("nueva región") || t.includes("aparece un lugar") || t.includes("se funda") || t.includes("se descubre")) {
    const palabras = texto.split(" ");
    const lugar = palabras.find(p => p[0] === p[0].toUpperCase()); // busca palabra con mayúscula
    const refLugar = ref(db, 'lugares/' + (lugar || "nuevo_lugar"));
    update(refLugar, { descripcion: texto });
    return log(`Lugar '${lugar}' registrado.`);
  }

  // Cambio de estado HP (búsqueda por "hp", "herido", etc.)
  if (t.includes("hp") && t.includes("kaelen")) {
    const valor = texto.match(/\d+\/\d+/);
    const refPj = ref(db, 'personajes/kaelen');
    update(refPj, { hp: valor ? valor[0] : "?" });
    return log("HP de Kaelen actualizado.");
  }

  // Registro libre si no se detecta nada
  const refHist = ref(db, 'historia');
  push(refHist, { tipo: "registro", contenido: texto });
  log("Entrada libre registrada.");
}

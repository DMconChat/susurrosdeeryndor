
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
console.log("Bot Narrador v2.0 conectado correctamente.");

function log(msg) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += "<p>> " + msg + "</p>";
  logDiv.scrollTop = logDiv.scrollHeight;
}

window.procesarComando = function () {
  const entrada = document.getElementById("comando").value.trim();
  if (!entrada) return;
  const comandos = entrada.split(" /").filter(c => c.length);
  comandos.forEach(c => ejecutar(c.trim()));
  document.getElementById("comando").value = "";
}

function ejecutar(c) {
  if (c.startsWith("narrar")) {
    const texto = c.replace("narrar", "").trim();
    const refHist = ref(db, 'historia');
    push(refHist, { tipo: "narracion", contenido: texto });
    log("Narración guardada en historia.");
  } else if (c.startsWith("guardar")) {
    const texto = c.replace("guardar", "").trim();
    const refHist = ref(db, 'historia');
    push(refHist, { tipo: "registro", contenido: texto });
    log("Registro libre guardado.");
  } else if (c.startsWith("evento")) {
    const datos = extraerArgumentos(c);
    if (!datos.id || !datos.contenido) return log("Error: evento incompleto.");
    const evento = {
      tipo: datos.tipo || "accion",
      ubicacion: datos.ubicacion || "desconocida",
      contenido: datos.contenido
    };
    const refEv = ref(db, "lore/eventos/" + datos.id);
    update(refEv, evento);
    log(`Evento '${datos.id}' registrado en lore/eventos.`);
  } else if (c.startsWith("actualizar")) {
    const datos = extraerArgumentos(c);
    if (!datos.personaje) return log("Error: personaje no definido.");
    const actualizacion = {};
    if (datos.hp) actualizacion.hp = datos.hp;
    if (datos.efectos) actualizacion.efectos = datos.efectos.split(",");
    const refPj = ref(db, "personajes/" + datos.personaje);
    update(refPj, actualizacion);
    log(`Personaje '${datos.personaje}' actualizado.`);
  } else if (c.startsWith("descripcion")) {
    const datos = extraerArgumentos(c);
    if (!datos.personaje || !datos.contenido) return log("Error: descripción incompleta.");
    const refPj = ref(db, "personajes/" + datos.personaje);
    update(refPj, { descripcion: datos.contenido });
    log(`Descripción añadida a '${datos.personaje}'.`);
  } else if (c.startsWith("registrar")) {
    const datos = extraerArgumentos(c);
    if (!datos.lugar || !datos.descripcion) return log("Error: registro de lugar incompleto.");
    const refLugar = ref(db, "lugares/" + datos.lugar);
    update(refLugar, { descripcion: datos.descripcion });
    log(`Lugar '${datos.lugar}' registrado en /lugares.`);
  } else if (c.startsWith("accion")) {
    const datos = extraerArgumentos(c);
    if (!datos.personaje || !datos.contenido) return log("Error: acción incompleta.");
    const refHist = ref(db, "historia");
    push(refHist, { tipo: "accion", personaje: datos.personaje, contenido: datos.contenido });
    log(`Acción registrada de '${datos.personaje}'.`);
  } else {
    log("Comando no reconocido: " + c);
  }
}

function extraerArgumentos(c) {
  const obj = {};
  c.split(" ").forEach(parte => {
    const [clave, ...valor] = parte.split("=");
    if (valor.length) obj[clave.trim()] = valor.join("=").replace(/^"|"$/g, '');
  });
  return obj;
}

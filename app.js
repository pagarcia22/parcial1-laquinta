// ===== CONFIGURACIÓN =====
const WEBHOOK_URL = "https://hook.us2.make.com/nj8kzbpwkmviv9xsdl4klhyktyyswu0z";
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAko6mdRpkat6WwBUkj6vaJvKfwSMAeVl6wgw_Bv54dPLdEDNlayXRTTvKSwdKl9AamgtV7CDxYDAc/pub?gid=134197244&single=true&output=csv";

// ===== ELEMENTOS DE LA PÁGINA =====
const btnRegistro = document.getElementById("btn-registro");
const btnHistorial = document.getElementById("btn-historial");
const vistaRegistro = document.getElementById("vista-registro");
const vistaHistorial = document.getElementById("vista-historial");
const form = document.getElementById("form-despacho");
const btnEnviar = document.getElementById("btn-enviar");
const cuadro = document.getElementById("resultado");
const resEstado = document.getElementById("res-estado");
const resMensaje = document.getElementById("res-mensaje");
const aviso = document.getElementById("hist-estado");
const cuerpo = document.querySelector("#tabla tbody");

// ===== CAMBIO DE VISTA =====
function mostrarVista(cual) {
  vistaRegistro.hidden = cual !== "registro";
  vistaHistorial.hidden = cual !== "historial";
  btnRegistro.classList.toggle("activo", cual === "registro");
  btnHistorial.classList.toggle("activo", cual === "historial");
}

btnRegistro.addEventListener("click", () => mostrarVista("registro"));
btnHistorial.addEventListener("click", () => {
  mostrarVista("historial");
  cargarHistorial();
});
document.getElementById("btn-actualizar").addEventListener("click", cargarHistorial);

// ===== ENVÍO DEL DESPACHO A MAKE =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  btnEnviar.disabled = true;
  btnEnviar.textContent = "Validando…";
  cuadro.hidden = true;

  const datos = new URLSearchParams(new FormData(form));
  datos.set("codigo_producto", datos.get("codigo_producto").trim().toUpperCase());

  try {
    const respuesta = await fetch(WEBHOOK_URL, { method: "POST", body: datos });
    const texto = await respuesta.text();
    let r;
    try { r = JSON.parse(texto); } catch { r = { estado: "ERROR", mensaje: texto }; }
    mostrarResultado(r.estado, r.mensaje);
  } catch (err) {
    mostrarResultado("ERROR", "No se pudo conectar con el proceso de validación: " + err.message);
  }

  btnEnviar.disabled = false;
  btnEnviar.textContent = "Registrar despacho";
});

// ===== MOSTRAR LA RESPUESTA =====
function mostrarResultado(estado, mensaje) {
  const clases = {
    "APROBADO": "aprobado",
    "APROBADO CON ALERTA": "alerta",
    "RECHAZADO": "rechazado",
    "RUTA DE RESPALDO": "respaldo"
  };
  cuadro.className = clases[estado] || "error";
  resEstado.textContent = estado;
  resMensaje.textContent = mensaje || "";
  cuadro.hidden = false;
}

// ===== HISTORIAL (lee la hoja Movimientos publicada como CSV) =====
async function cargarHistorial() {
  aviso.textContent = "Cargando…";
  cuerpo.innerHTML = "";
  try {
    const r = await fetch(CSV_URL + "&t=" + Date.now());
    if (!r.ok) throw new Error("Google respondió " + r.status);
    const filas = parsearCSV(await r.text()).slice(1);          // quita encabezados
    const datos = filas.filter(f => f.length > 1 && f[0]).reverse(); // más recientes primero
    if (datos.length === 0) { aviso.textContent = "Todavía no hay movimientos."; return; }
    aviso.textContent = datos.length + " movimientos";
    // columnas: fecha(0) id(1) producto(5) cantidad(6) destino(7) motivo(8) antes(9) despues(10) resultado(12)
    const cols = [0, 1, 5, 6, 7, 8, 9, 10, 12];
    datos.forEach(f => {
      const tr = document.createElement("tr");
      cols.forEach(i => {
        const td = document.createElement("td");
        td.textContent = f[i] || "";
        tr.appendChild(td);
      });
      cuerpo.appendChild(tr);
    });
  } catch (err) {
    aviso.textContent = "No se pudo cargar el historial: " + err.message;
  }
}

// Lector sencillo de CSV (respeta comillas)
function parsearCSV(t) {
  const filas = []; let fila = [], campo = "", comillas = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (comillas) {
      if (c === '"' && t[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ",") { fila.push(campo); campo = ""; }
    else if (c === "\n") { fila.push(campo); filas.push(fila); fila = []; campo = ""; }
    else if (c !== "\r") campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas;
}

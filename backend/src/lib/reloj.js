import { q } from '../db.js';

/*
 * Reloj simulado. La hora simulada se guarda en la tabla «sistema»:
 *   hora = reloj_base + (hora_real − real_base)
 * Avanza sola segundo a segundo y se puede adelantar (+1 hora, +1 día…).
 */
export const H = 36e5;
export const D = 864e5;
const SV = -6 * H; // El Salvador: UTC−6 todo el año (sin horario de verano)

let offset = 0;

export async function cargarReloj() {
  const { rows } = await q('SELECT reloj_base, real_base FROM sistema WHERE id = 1');
  offset = rows[0].reloj_base - rows[0].real_base;
}

export const ahora = () => Date.now() + offset;

export async function adelantar(ms) {
  await q("UPDATE sistema SET reloj_base = reloj_base + $1 * interval '1 millisecond', actualizado = now() WHERE id = 1", [ms]);
  offset += ms;
}

/* ---- fechas en hora de El Salvador, sin depender de la zona del servidor ---- */
const local = (t) => new Date(t + SV);
export const inicioDia = (t) => Math.floor((t + SV) / D) * D - SV;
export const horaDelDia = (t) => { const d = local(t); return d.getUTCHours() + d.getUTCMinutes() / 60; };
export const diaSemana = (t) => (local(t).getUTCDay() + 6) % 7; // 0 = lunes
export const lunes = (t) => inicioDia(t) - diaSemana(t) * D;
export const semanaKey = (t) => local(lunes(t)).toISOString().slice(0, 10);

const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const dos = (n) => String(n).padStart(2, '0');
/** «22 nov · 09:20» */
export function fmt(t) {
  const d = local(t);
  return `${d.getUTCDate()} ${MES[d.getUTCMonth()]} · ${dos(d.getUTCHours())}:${dos(d.getUTCMinutes())}`;
}
/** «24 nov 2026» */
export function fFecha(t) {
  const d = local(t);
  return `${d.getUTCDate()} ${MES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

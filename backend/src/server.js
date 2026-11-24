import { app } from './app.js';
import { config } from './config.js';
import { cargarReloj } from './lib/reloj.js';
import { correrProcesos } from './lib/procesos.js';

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Espera a que la base de datos esté lista (útil al arrancar con Docker). */
async function conectar() {
  for (let i = 1; ; i++) {
    try {
      await cargarReloj();
      return;
    } catch (e) {
      if (i >= 30) throw e;
      console.log(`Esperando a la base de datos… (${i})`);
      await espera(2000);
    }
  }
}

await conectar();
await correrProcesos();

app.listen(config.port, () => {
  console.log(`API de Orígenes SV en http://localhost:${config.port} · modo demo: ${config.demo ? 'sí' : 'no'}`);
});

// El reloj simulado avanza solo: cada 10 s se corren los procesos (llegadas, vencimientos, ofertas…)
setInterval(() => correrProcesos().catch((e) => console.error('Procesos:', e.message)), 10_000);

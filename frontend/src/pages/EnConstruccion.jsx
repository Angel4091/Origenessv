import { useSesion } from '../context/Sesion.jsx';
import { ROLES } from '../roles.js';
import { Card } from '../components/ui.jsx';
import { Icono } from '../components/Icono.jsx';

/** Pantallas de roles que se construyen en fases siguientes (la base de datos ya las soporta). */
export default function EnConstruccion() {
  const { usuario } = useSesion();
  const R = ROLES[usuario.rol];
  return (
    <Card className="tw:flex tw:items-center tw:gap-4">
      <span className="tw:grid tw:place-items-center tw:w-14 tw:h-14 tw:rounded-full tw:bg-wabg tw:text-wa tw:shrink-0"><Icono n="clock" size={26} /></span>
      <div>
        <h3 className="tw:text-base tw:m-0">Pantalla en construcción</h3>
        <p className="tw:text-tx2 tw:m-0 tw:mt-1">
          Las pantallas de {R.nombre.toLowerCase()} se construyen en la fase {R.fase}. La base de datos, la API base y tu acceso ya están listos;
          mientras tanto puedes usar <b>Mi perfil</b> desde el menú de tu foto.
        </p>
      </div>
    </Card>
  );
}

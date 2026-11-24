/* Pantalla de cada entrada del menú («rol/entrada»). Lo que no está aquí se muestra «en construcción». */
import NuevoPedido from './mesero/NuevoPedido.jsx';
import MisPedidos from './mesero/MisPedidos.jsx';
import Mesas from './mesero/Mesas.jsx';
import Cobro from './mesero/Cobro.jsx';
import MiCaja from './mesero/MiCaja.jsx';
import HistorialMesero from './mesero/Historial.jsx';
import MiPedido from './cocinero/MiPedido.jsx';
import Proponer from './cocinero/Proponer.jsx';
import HistorialCocinero from './cocinero/Historial.jsx';
import ColaPedidos from './jefe/ColaPedidos.jsx';
import CocinaEnVivo from './jefe/CocinaEnVivo.jsx';
import Reposiciones from './jefe/Reposiciones.jsx';
import Recetas from './jefe/Recetas.jsx';
import HistorialJefe from './jefe/Historial.jsx';

export const PAGINAS = {
  'mesero/nuevo': NuevoPedido,
  'mesero/pedidos': MisPedidos,
  'mesero/mesas': Mesas,
  'mesero/cobro': Cobro,
  'mesero/caja': MiCaja,
  'mesero/historial': HistorialMesero,
  'cocinero/mipedido': MiPedido,
  'cocinero/proponer': Proponer,
  'cocinero/historial': HistorialCocinero,
  'jefe/cola': ColaPedidos,
  'jefe/vivo': CocinaEnVivo,
  'jefe/reposiciones': Reposiciones,
  'jefe/recetas': Recetas,
  'jefe/historial': HistorialJefe,
};

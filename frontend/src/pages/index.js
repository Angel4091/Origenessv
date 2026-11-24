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
import Inventario from './bodega/Inventario.jsx';
import Alertas from './bodega/Alertas.jsx';
import ComprasBodega from './bodega/Compras.jsx';
import Recepcion from './bodega/Recepcion.jsx';
import Conteo from './bodega/Conteo.jsx';
import ResumenGerente from './gerente/Resumen.jsx';
import Aprobaciones from './gerente/Aprobaciones.jsx';
import MenuSucursal from './gerente/Menu.jsx';
import Mermas from './gerente/Mermas.jsx';
import Pedir from './gerente/Pedir.jsx';
import Equipo from './gerente/Equipo.jsx';

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
  'bodega/inventario': Inventario,
  'bodega/alertas': Alertas,
  'bodega/compras': ComprasBodega,
  'bodega/recepcion': Recepcion,
  'bodega/conteo': Conteo,
  'gerente/resumen': ResumenGerente,
  'gerente/aprobaciones': Aprobaciones,
  'gerente/menu': MenuSucursal,
  'gerente/mermas': Mermas,
  'gerente/pedir': Pedir,
  'gerente/equipo': Equipo,
};

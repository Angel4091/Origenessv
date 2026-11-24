/*
 * Menú de cada rol (máx. 6 entradas) y sus pestañas. Las pantallas de esta fase
 * (mesero, cocinero y jefe de cocina) están construidas; las demás se construyen en su fase.
 */
const T = (s) => s.split(',').map((x) => { const [id, label] = x.split(':'); return { id, label }; });
const M = (id, label, ic, tabs, titulo, fase) => ({ id, label, ic, tabs: tabs ? T(tabs) : null, titulo: titulo || label, fase });

export const ROLES = {
  mesero: {
    nombre: 'Mesero', alcance: 'sucursal', entra: 'nuevo',
    menu: [
      M('nuevo', 'Nuevo pedido', 'plus'),
      M('pedidos', 'Mis pedidos', 'list'),
      M('mesas', 'Mesas', 'users'),
      M('cobro', 'Cobro', 'dollar'),
      M('caja', 'Mi caja', 'box'),
      M('historial', 'Mi historial', 'clock', 'pedidos:Pedidos hechos,ventas:Ventas,solicitudes:Solicitudes'),
    ],
  },
  cocinero: {
    nombre: 'Cocinero', alcance: 'sucursal', entra: 'mipedido',
    menu: [
      M('mipedido', 'Mi pedido', 'list', 'actual:En preparación,cola:En cola'),
      M('proponer', 'Proponer', 'plus', 'producto:Producto,extra:Extra nuevo,categoria:Nueva categoría'),
      M('historial', 'Mi historial', 'clock', 'pedidos:Pedidos,propuestas:Mis propuestas'),
    ],
  },
  jefe: {
    nombre: 'Jefe de cocina', alcance: 'sucursal', entra: 'cola',
    menu: [
      M('cola', 'Cola de pedidos', 'list', 'nuevos:Nuevos,aceptados:Por asignar,prep:Preparándose,encola:En cola'),
      M('vivo', 'Cocina en vivo', 'users'),
      M('reposiciones', 'Reposiciones y pérdidas', 'box', 'reposiciones:Reposiciones,cancelaciones:Cancelaciones,devoluciones:Devoluciones,perdidas:Pérdidas registradas', 'Reposiciones, cancelaciones y devoluciones'),
      M('recetas', 'Recetas y catálogo', 'check', 'productos:Productos,extras:Extras,categorias:Categorías,propuestas:Propuestas de cocineros'),
      M('historial', 'Historial', 'clock', 'pedidos:Pedidos atendidos,decisiones:Propuestas decididas'),
    ],
  },
  bodega: {
    nombre: 'Encargado de bodega', alcance: 'sucursal', entra: 'inventario',
    menu: [
      M('inventario', 'Inventario', 'box'),
      M('alertas', 'Alertas', 'bell', 'stock:Stock bajo,vencer:Lotes por vencer'),
      M('compras', 'Compras', 'dollar', null, 'Solicitudes de compra'),
      M('recepcion', 'Recepción', 'check', 'camino:En camino,enviadas:Enviadas al gerente', 'Recepción de mercancía'),
      M('conteo', 'Conteo físico', 'list'),
    ],
  },
  gerente: {
    nombre: 'Gerente de sucursal', alcance: 'sucursal', entra: 'resumen',
    menu: [
      M('resumen', 'Resumen', 'home', null, 'Resumen de sucursal'),
      M('aprobaciones', 'Aprobaciones', 'check', 'productos:Productos,compras:Compras,recepcion:Recepción,ofertas:Ofertas,caja:Caja,conteos:Conteos de inventario,solicitudes:Solicitudes del equipo,historial:Historial de aprobaciones'),
      M('menu', 'Menú', 'list', 'mi:Mi menú,catalogo:Catálogo de la franquicia,historial:Historial de productos', 'Menú de la sucursal'),
      M('mermas', 'Mermas', 'box'),
      M('pedir', 'Pedir a gerencia', 'dollar'),
      M('equipo', 'Equipo', 'users', 'equipo:Equipo,plantilla:Plantilla'),
    ],
  },
  rrhh: {
    nombre: 'Recursos Humanos', alcance: 'franquicia', entra: 'personal', fase: 5,
    menu: [M('personal', 'Personal', 'users'), M('roles', 'Roles y salarios', 'dollar'), M('turnos', 'Turnos', 'clock'), M('pagos', 'Pagos', 'list', 'planilla:Planilla,reportes:Reportes de pago')],
  },
  gg: {
    nombre: 'Gerente general', alcance: 'franquicia', entra: 'panel', fase: 5,
    menu: [
      M('panel', 'Panel', 'home'),
      M('aprobaciones', 'Aprobaciones', 'check', 'compras:Compras,proveedores:Proveedores,precios:Precios'),
      M('productos', 'Productos', 'box', 'propuestas:Propuestas,catalogo:Catálogo'),
      M('dinero', 'Dinero', 'dollar', 'cxp:Cuentas por pagar,nomina:Nómina'),
      M('sucursales', 'Sucursales', 'box', 'sucursales:Sucursales,despidos:Despidos,plantilla:Plantilla'),
    ],
  },
  director: {
    nombre: 'Director', alcance: 'franquicia', entra: 'ingresos', fase: 6,
    menu: [
      M('ingresos', 'Ingresos', 'dollar'), M('aprobaciones', 'Aprobaciones', 'check'),
      M('franquicia', 'Franquicia', 'box', 'sucursales:Sucursales,catalogo:Catálogo'), M('directores', 'Directores', 'users'), M('bitacora', 'Bitácora', 'list'),
    ],
  },
};

/** Pendientes de la campana: pestañas con número o, si la entrada no tiene pestañas, su contador. */
export function pendientesDe(rol, pend) {
  const R = ROLES[rol];
  const out = [];
  if (!R) return out;
  for (const it of R.menu) {
    const tabs = (it.tabs || []).map((t) => ({ t, n: pend.tabs[`${it.id}/${t.id}`] || 0 })).filter((x) => x.n);
    if (tabs.length) tabs.forEach((x) => out.push({ n: x.n, txt: x.t.label, sub: it.label, href: `/${rol}/${it.id}/${x.t.id}`, ic: it.ic }));
    else if (pend.menu[it.id]) out.push({ n: pend.menu[it.id], txt: it.label, sub: '', href: `/${rol}/${it.id}`, ic: it.ic });
  }
  return out;
}

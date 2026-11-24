import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal, Toast, ToastContainer, Form } from 'react-bootstrap';
import { Btn } from '../components/ui.jsx';
import { sonar } from '../lib/sonido.js';
import { useSesion } from './Sesion.jsx';

/*
 * Diálogos globales que devuelven una promesa (igual que el borrador):
 *   toast(texto) · confirmar({titulo, texto, verbo, rojo}) → bool · motivo({titulo}) → texto ≥ 10 | null
 *   accion(fn, mensajeOk) → ejecuta, muestra el error si falla y recarga los datos si sale bien
 */
const Ctx = createContext(null);
const MALO = /no tienes|revisa|escribe|elige|ya existe|debe |necesita|no alcanz|ocupad|no se pudo|no se encontr|inv[áa]lid|incorrect|falta|agrega al menos|bloquead|no puedes|no es posible|m[áa]ximo|no coincid|repetid|obligatori|aún no|ya no|ya hay|primero|termina/i;

export function DialogosProvider({ children }) {
  const { recargar } = useSesion();
  const [toasts, setToasts] = useState([]);
  const [dlg, setDlg] = useState(null);
  const [texto, setTexto] = useState('');
  const sig = useRef(0);

  const toast = useCallback((t) => {
    const id = ++sig.current;
    if (MALO.test(String(t))) sonar('falla');
    setToasts((l) => [...l.slice(-2), { id, t }]);
    setTimeout(() => setToasts((l) => l.filter((x) => x.id !== id)), 3200);
  }, []);

  const confirmar = useCallback((o) => new Promise((resolve) => setDlg({ tipo: 'confirmar', ...o, resolve })), []);
  const motivo = useCallback((o = {}) => new Promise((resolve) => { setTexto(''); setDlg({ tipo: 'motivo', ...o, resolve }); }), []);

  const accion = useCallback(async (fn, ok) => {
    try {
      const r = await fn();
      if (ok) toast(ok);
      recargar();
      return r ?? true;
    } catch (e) {
      toast(e.message || 'No se pudo completar la acción');
      return null;
    }
  }, [toast, recargar]);

  const cerrar = (valor) => { dlg?.resolve(valor); setDlg(null); };
  const valor = useMemo(() => ({ toast, confirmar, motivo, accion }), [toast, confirmar, motivo, accion]);
  const n = texto.trim().length;

  return (
    <Ctx.Provider value={valor}>
      {children}

      <Modal show={!!dlg} onHide={() => cerrar(dlg?.tipo === 'motivo' ? null : false)} centered size="sm" dialogClassName="tw:max-w-[440px]">
        {dlg?.tipo === 'confirmar' && (
          <Modal.Body>
            <h3>{dlg.titulo}</h3>
            {dlg.texto && <p className="tw:text-tx2 tw:m-0">{dlg.texto}</p>}
            <div className="tw:flex tw:justify-end tw:gap-2 tw:mt-2">
              <Btn onClick={() => cerrar(false)}>Volver</Btn>
              <Btn v={dlg.rojo ? 'red' : 'p'} onClick={() => cerrar(true)} autoFocus>{dlg.verbo || 'Confirmar'}</Btn>
            </div>
          </Modal.Body>
        )}
        {dlg?.tipo === 'motivo' && (
          <Modal.Body>
            <h3>{dlg.titulo || 'Motivo'}</h3>
            {dlg.nota && <small className="tw:text-tx2">{dlg.nota}</small>}
            <Form.Control as="textarea" rows={3} autoFocus value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe la razón" />
            <small className="tw:text-tx2">{n} / mín. 10</small>
            <div className="tw:flex tw:justify-end tw:gap-2">
              <Btn v="t" onClick={() => cerrar(null)}>Cancelar</Btn>
              <Btn v="p" disabled={n < 10} onClick={() => cerrar(texto.trim())}>{dlg.verbo || 'Enviar'}</Btn>
            </div>
          </Modal.Body>
        )}
      </Modal>

      <ToastContainer position="bottom-center" className="tw:mb-24 tw:md:mb-10 tw:flex tw:flex-col tw:items-center" style={{ zIndex: 2000 }}>
        {toasts.map((x) => (
          <Toast key={x.id} className="toast-osv">
            <Toast.Body><span className="tw:inline-block tw:w-2 tw:h-4 tw:rounded tw:bg-[#CFE8E3]" />{x.t}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </Ctx.Provider>
  );
}

export const useDialogos = () => useContext(Ctx);

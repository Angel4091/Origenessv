import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { api } from '../lib/api.js';
import { fTel, valTel, valCorreo } from '../lib/formato.js';
import { useSesion } from '../context/Sesion.jsx';
import { useDialogos } from '../context/Dialogos.jsx';
import { Avatar, Btn, Campo, Card, Err, Mut } from '../components/ui.jsx';

/** Reduce la imagen elegida (máx. 640 px) y la devuelve como data URL JPG. */
function leerFoto(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('No se pudo leer la imagen. Elige un archivo JPG o PNG.'));
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, 640 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = () => reject(new Error('No se pudo leer la imagen. Elige un archivo JPG o PNG.'));
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

const Dato = ({ l, v }) => <div><small className="tw:text-tx2">{l}</small><div>{v || '—'}</div></div>;

/** Formulario de cambio con tres campos (contraseña, PIN o clave). */
function Cambio({ titulo, url, campos, nota, extraArriba, onListo }) {
  const { accion } = useDialogos();
  const vacio = Object.fromEntries(campos.map((c) => [c.k, '']));
  const [f, setF] = useState(vacio);
  const [er, setEr] = useState('');
  const enviar = async () => {
    setEr('');
    try {
      const r = await api.put(url, f);
      setF(vacio);
      onListo(r.usuario);
    } catch (e) { setEr(e.message); }
  };
  return (
    <Card className="tw:flex tw:flex-col tw:gap-3">
      <h3 className="tw:text-[15px] tw:m-0">{titulo}</h3>
      {extraArriba}
      {campos.map((c) => (
        <Campo key={c.k} l={c.l}>
          <Form.Control type="password" inputMode={c.num ? 'numeric' : undefined} maxLength={c.num ? 6 : undefined} autoComplete={c.ac || 'off'}
            value={f[c.k]} onChange={(e) => setF({ ...f, [c.k]: e.target.value })} />
        </Campo>
      ))}
      <Err>{er}</Err>
      <div><Btn onClick={() => accion(enviar)}>{titulo}</Btn></div>
      {nota && <Mut>{nota}</Mut>}
    </Card>
  );
}

export default function Perfil() {
  const { usuario: u, actualizarUsuario } = useSesion();
  const { toast, accion } = useDialogos();
  const navigate = useNavigate();
  const [d, setD] = useState({ telefono: u.telefono, correo: u.correo });
  const archivo = useRef(null);
  const listo = (msg, temporal) => (nuevo) => {
    actualizarUsuario(nuevo);
    toast(msg);
    if (temporal && !nuevo.cambiarPass && !nuevo.cambiarPin) navigate(`/${nuevo.rol}/${nuevo.entra}`);
  };

  const guardar = () => accion(async () => {
    const ev = (d.telefono && valTel(d.telefono)) || (d.correo && valCorreo(d.correo));
    if (ev) throw new Error(ev);
    const r = await api.put('/perfil', d);
    actualizarUsuario(r.usuario);
  }, 'Datos guardados');

  const subirFoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    accion(async () => {
      const dataUrl = await leerFoto(file);
      actualizarUsuario((await api.put('/perfil/foto', { dataUrl })).usuario);
    }, 'Foto actualizada');
  };

  return (
    <div className="tw:grid tw:gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))' }}>
      {(u.cambiarPass || u.cambiarPin) && (
        <div className="tw:col-span-full tw:rounded-2xl tw:bg-[#FFF8E6] tw:border tw:border-[#F0D08A] tw:text-[#7A5200] tw:px-4 tw:py-3">
          {u.cambiarPass ? 'Tienes una contraseña temporal: cámbiala para poder usar el sistema.' : 'Debes fijar un PIN nuevo para poder usar el sistema.'}
        </div>
      )}
      <Card className="tw:flex tw:flex-col tw:gap-3">
        <h3 className="tw:text-[15px] tw:m-0">Mis datos</h3>
        <div className="tw:flex tw:gap-4 tw:items-center tw:pb-2">
          <Avatar u={u} size={88} />
          <div className="tw:flex tw:flex-col tw:gap-1">
            <b>{u.nombre}</b>
            <div className="tw:flex tw:flex-wrap tw:gap-1">
              <Btn v="t" onClick={() => archivo.current.click()}>{u.foto ? 'Cambiar foto' : 'Agregar foto'}</Btn>
              {u.foto && <Btn v="t" onClick={() => accion(async () => actualizarUsuario((await api.del('/perfil/foto')).usuario), 'Foto quitada')}>Quitar</Btn>}
            </div>
            {!u.foto && <Mut>Sin foto: se muestran tus iniciales</Mut>}
          </div>
          <input ref={archivo} type="file" accept="image/*" hidden onChange={subirFoto} />
        </div>
        <Dato l="Nombre" v={u.nombre} />
        <Dato l="Usuario" v={u.usuario} />
        <Dato l="Rol" v={u.rolNombre} />
        <Dato l="Sucursal" v={u.sucursalNombre || 'Toda la franquicia'} />
        <Campo l="Teléfono"><Form.Control inputMode="numeric" placeholder="0000-0000" maxLength={9} value={d.telefono} onChange={(e) => setD({ ...d, telefono: fTel(e.target.value) })} /></Campo>
        <Campo l="Correo"><Form.Control type="email" value={d.correo} onChange={(e) => setD({ ...d, correo: e.target.value })} /></Campo>
        <div><Btn v="p" onClick={guardar}>Guardar datos</Btn></div>
      </Card>

      <Cambio titulo="Cambiar contraseña" url="/perfil/password" onListo={listo('Contraseña actualizada', u.cambiarPass)}
        extraArriba={u.recupPass && <Mut>Entraste solo con tu PIN: escribe una contraseña nueva.</Mut>}
        campos={[...(u.recupPass ? [] : [{ k: 'actual', l: 'Contraseña actual', ac: 'current-password' }]),
          { k: 'nueva', l: 'Contraseña nueva', ac: 'new-password' }, { k: 'repetir', l: 'Repetir contraseña nueva', ac: 'new-password' }]}
        nota={u.rol === 'director' ? 'Si la olvidas, otro director te asignará una temporal desde el inicio de sesión.'
          : 'Si la olvidas, pídela desde el inicio de sesión: la persona responsable te asignará una temporal.'} />

      {u.rol === 'gerente' && (
        <Cambio titulo="Cambiar clave" url="/perfil/clave" onListo={listo('Clave actualizada')}
          campos={[{ k: 'actual', l: 'Clave actual', num: 1 }, { k: 'nueva', l: 'Clave nueva (4 a 6 números)', num: 1 }, { k: 'repetir', l: 'Repetir clave nueva', num: 1 }]}
          nota="Es la clave que escribes para aprobar compras, descuentos, despidos y otras decisiones. Es distinta de tu contraseña." />
      )}

      {u.rol === 'director' && (
        <Cambio titulo="Cambiar PIN" url="/perfil/pin" onListo={listo('PIN actualizado', u.cambiarPin)}
          extraArriba={u.recupPin && <Mut>Entraste solo con tu contraseña: escribe un PIN nuevo.</Mut>}
          campos={[...(u.recupPin ? [] : [{ k: 'actual', l: 'PIN actual', num: 1 }]), { k: 'nuevo', l: 'PIN nuevo (4 a 6 números)', num: 1 }, { k: 'repetir', l: 'Repetir PIN nuevo', num: 1 }]}
          nota="Los directores entran con contraseña y PIN." />
      )}
    </div>
  );
}

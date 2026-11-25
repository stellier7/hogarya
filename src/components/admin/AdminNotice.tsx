const messages: Record<string, string> = {
  guardada: "Los cambios se guardaron.",
  estado: "El estado se actualizó.",
  "sin-autorizacion": "No se publicó porque la inmobiliaria o el agente no están autorizados.",
  eliminada: "La propiedad se eliminó.",
  "sin-permiso": "No tiene permiso para esa acción.",
  foto: "Las fotografías se actualizaron.",
  "foto-invalida": "Use una imagen JPG, PNG o WebP de menos de 3 MB.",
  "sin-foto": "Seleccione una fotografía.",
  incompleta: "Complete los campos obligatorios.",
  creado: "El acceso se creó. Entregue la contraseña por un canal seguro; no queda visible en el panel.",
  "estado-invalido": "Ese estado no existe.",
};

export function AdminNotice({ code }: { code?: string }) {
  if (!code || !messages[code]) return null;
  return <p role="status" className="border border-gold bg-white px-4 py-3 text-sm">{messages[code]}</p>;
}

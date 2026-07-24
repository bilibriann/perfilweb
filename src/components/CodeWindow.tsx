'use client';

interface Endpoint {
  metodo: string;   // nombre del método (get color acento)
  ruta: string;     // ruta del @Get('...')
  valor: string;    // texto que se muestra como string de retorno
  enlace: string;   // href del enlace
}

const ENDPOINTS: Endpoint[] = [
  {
    metodo: 'github',
    ruta:   'github',
    valor:  'github.com/bilibriann',
    enlace: 'https://github.com/bilibriann',
  },
  {
    metodo: 'linkedin',
    ruta:   'linkedin',
    valor:  'linkedin.com/brian-vilches',
    enlace: 'https://linkedin.com/in/brian-vilches/',
  },
  {
    metodo: 'email',
    ruta:   'email',
    valor:  'b.vilchesm@gmail.com',
    enlace: 'mailto:b.vilchesm@gmail.com',
  },
];

export default function VentanaContacto() {
  // Colores fijos de "editor oscuro": la ventana se mantiene legible
  // aunque la sección tenga un fondo claro (vainilla).
  const muted  = { color: '#8b949e' } as const;
  const accent = { color: '#4ec9b0' } as const;

  // Construimos las líneas del "código" para poder numerarlas automáticamente.
  const lineas: React.ReactNode[] = [
    <div key="ctrl"><span className="text-purple-400">@Controller</span><span style={muted}>(&apos;contact&apos;)</span></div>,
    <div key="class"><span className="text-blue-400">export class </span><span className="text-yellow-300">ContactController </span><span style={muted}>{'{'}</span></div>,
  ];

  ENDPOINTS.forEach(({ metodo, ruta, valor, enlace }) => {
    lineas.push(<div key={`sp-${metodo}`}>&nbsp;</div>);
    lineas.push(
      <div key={`get-${metodo}`} className="ml-4">
        <span className="text-purple-400">@Get</span><span style={muted}>(&apos;{ruta}&apos;)</span>
      </div>,
    );
    lineas.push(
      <div key={`sig-${metodo}`} className="ml-4">
        <span style={accent}>{metodo}</span><span style={muted}>(): </span>
        <span className="text-yellow-300">string</span><span style={muted}>{' {'}</span>
      </div>,
    );
    lineas.push(
      <div key={`ret-${metodo}`} className="ml-8">
        <span className="text-blue-400">return </span>
        <a
          href={enlace}
          target={enlace.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="text-green-400 hover:underline"
        >
          &apos;{valor}&apos;
        </a>
        <span style={muted}>;</span>
      </div>,
    );
    lineas.push(<div key={`end-${metodo}`} className="ml-4"><span style={muted}>{'}'}</span></div>);
  });

  lineas.push(<div key="close"><span style={muted}>{'}'}</span></div>);

  return (
    <div
      className="overflow-hidden rounded-md"
      style={{ border: '1px solid #2a2f3a', background: '#0d1117' }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: '#161b22', borderBottom: '1px solid #2a2f3a' }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
        <span className="ml-3 text-xs font-mono" style={{ color: '#8b949e' }}>
          contact.controller.ts
        </span>
      </div>
      <div className="p-5 font-mono text-[13px] leading-6 overflow-x-auto">
        <div className="flex gap-4">
          <div className="select-none text-right shrink-0" style={{ color: '#484f58' }}>
            {lineas.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <div className="leading-6">
            {lineas}
          </div>
        </div>
      </div>
    </div>
  );
}

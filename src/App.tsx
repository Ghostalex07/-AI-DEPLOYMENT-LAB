/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Briefcase, 
  Database, 
  Cpu, 
  ShieldAlert, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Zap,
  BarChart3,
  Layers,
  Globe,
  Lock,
  Server,
  Smartphone,
  Workflow
} from 'lucide-react';

// --- Constants & Types ---

const COLORS = {
  bg: '#03040f',
  panel: '#060814',
  card: '#090d20',
  border: '#111830',
  borderL: '#1a2448',
  ind: '#6366f1',
  indDim: 'rgba(99,102,241,0.13)',
  amber: '#f59e0b',
  amberDim: 'rgba(245,158,11,0.11)',
  em: '#10b981',
  emDim: 'rgba(16,185,129,0.11)',
  cyan: '#22d3ee',
  cyanDim: 'rgba(34,211,238,0.1)',
  purple: '#a855f7',
  purpleDim: 'rgba(168,85,247,0.13)',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.1)',
  sky: '#38bdf8',
  text: '#e2e8f0',
  sub: '#94a3b8',
  muted: '#3d4f6e'
};

const CASES = [
  {
    id: 'health',
    icon: '🏥',
    sector: 'Salud',
    col: COLORS.em,
    title: 'Resumen Clínico & Codificación Asistida',
    org: 'Hospital universitario — 8 centros, 1.200 profesionales sanitarios',
    objective: 'Automatizar resúmenes de historia clínica y codificación CIE-10 para reducir carga documental en urgencias y consultas externas.',
    users: 1200,
    freq: 40,
    budget: 18000,
    latency: 'Alta (<2s)',
    sensitivity: 'Muy alta (PII/PHI)',
    regulatory: 'RGPD · LOPDGDD · ENS · AI Act (alto riesgo)',
    constraints: [
      'Datos no pueden salir de infraestructura EU',
      'Auditoría obligatoria de cada decisión automática',
      'Validación humana en toda inferencia clínica',
      'Presupuesto cerrado, no ampliable en 18 meses'
    ],
    signals: [
      '30% del tiempo médico se consume en documentación',
      'Tasa de error en codificación manual: 12%',
      'Objetivo: reducir reingresos evitables un 15%'
    ]
  },
  {
    id: 'devtools',
    icon: '💻',
    sector: 'Tecnología',
    col: COLORS.sky,
    title: 'Copiloto Técnico para Desarrolladores',
    org: 'Empresa SaaS B2B — 45.000 desarrolladores activos en 60 países',
    objective: 'Asistente embebido en IDE para autocompletar código, generar tests unitarios y responder consultas sobre la API propia de la plataforma.',
    users: 45000,
    freq: 120,
    budget: 85000,
    latency: 'Muy alta (<500ms)',
    sensitivity: 'Media (código propietario)',
    regulatory: 'SOC2 Type II · ISO 27001 · CCPA',
    constraints: [
      'Latencia p99 < 500ms obligatoria',
      'Coste máximo $0.002/interacción',
      'Disponibilidad 99.9% · SLA contractual',
      'Sin retención de código en proveedor externo'
    ],
    signals: [
      'NPS de herramientas internas: 62',
      'Tiempo de onboarding a API: 3 semanas',
      'Churn correlaciona con fricción técnica en primeras 48h'
    ]
  },
  {
    id: 'banking',
    icon: '🏦',
    sector: 'Banca & Seguros',
    col: COLORS.amber,
    title: 'Atención al Cliente & Fraude Documental',
    org: 'Banco mediano — 280.000 clientes activos, operación en 5 países EU',
    objective: 'Chatbot regulatorio multilingüe para consultas de clientes y asistente de verificación de documentación en altas y siniestros.',
    users: 280000,
    freq: 8,
    budget: 120000,
    latency: 'Alta (<3s)',
    sensitivity: 'Muy alta (PII financiero)',
    regulatory: 'DORA · GDPR · PSD2 · MiFID II · AI Act',
    constraints: [
      'Explicabilidad completa de toda decisión automática',
      'Human-in-the-loop obligatorio para denegaciones',
      'Fallback local si falla proveedor principal',
      'Auditoría regulatoria completa exportable'
    ],
    signals: [
      'Coste por interacción humana: €4,20',
      '68% de consultas son repetitivas y resolubles',
      'Tasa fraude documental: 0,3% — pérdida media €12K/caso'
    ]
  },
  {
    id: 'retail',
    icon: '📦',
    sector: 'Retail & Logística',
    col: COLORS.purple,
    title: 'Previsión de Demanda & Asistente Operativo',
    org: 'Cadena de distribución — 320 almacenes, 8.500 operarios',
    objective: 'Modelo de previsión de demanda para optimizar stock y asistente conversacional para consultas operativas de empleados de almacén.',
    users: 8500,
    freq: 30,
    budget: 42000,
    latency: 'Media (<5s)',
    sensitivity: 'Baja-Media (datos operativos)',
    regulatory: 'RGPD básico · NIS2 (infraestructura)',
    constraints: [
      'Integración con ERP SAP existente',
      'Operarios con baja alfabetización digital',
      'Picos de volumen ×8 en campañas estacionales',
      'ROI demostrable en 6 meses'
    ],
    signals: [
      'Rotura de stock: €2,1M/año de pérdida',
      'Exceso inventario: €800K en capital parado',
      'Tiempo búsqueda de información por operario: 18 min/turno'
    ]
  }
];

const ARCHS = [
  {
    id: 'saas',
    name: 'SaaS / API Externa',
    icon: <Globe className="w-5 h-5" />,
    desc: 'Consumo directo de API de proveedor (OpenAI, Anthropic, Google) sin infraestructura propia.',
    pros: ['Setup inmediato', 'Sin CAPEX', 'Modelos SOTA actualizados', 'Escalabilidad automática'],
    cons: ['Datos salen a tercero', 'Vendor lock-in', 'Coste variable', 'Latencia de red externa'],
    bestFor: 'Prototipado, volumen bajo-medio, baja sensibilidad',
    ctrl: 20, lat: 70, cost: 82, priv: 20, scale: 90
  },
  {
    id: 'cloud_ow',
    name: 'Open-Weight en Nube',
    icon: <Server className="w-5 h-5" />,
    desc: 'Modelo open-weight (Llama, Mistral) desplegado en infraestructura cloud gestionada (AWS/Azure).',
    pros: ['Datos en tu cloud', 'Control del modelo', 'Sin royalties por token', 'Fine-tuning posible'],
    cons: ['Requiere MLOps', 'Rendimiento < SOTA', 'Coste fijo infra', 'Mantenimiento continuo'],
    bestFor: 'Datos sensibles, volumen alto, presupuesto fijo',
    ctrl: 70, lat: 75, cost: 52, priv: 80, scale: 65
  },
  {
    id: 'private',
    name: 'Despliegue Privado',
    icon: <Lock className="w-5 h-5" />,
    desc: 'Infraestructura on-premise or cloud privada dedicada. Máximo control, mínima dependencia.',
    pros: ['Máxima privacidad', 'Coste predecible', 'Sin latencia externa', 'Compliance total'],
    cons: ['Alta inversión inicial', 'Equipo especializado', 'Actualizaciones manuales', 'Escalado complejo'],
    bestFor: 'Regulación estricta, PII/PHI sensible, volumen muy alto',
    ctrl: 95, lat: 90, cost: 28, priv: 95, scale: 40
  },
  {
    id: 'edge',
    name: 'Edge / On-Device',
    icon: <Smartphone className="w-5 h-5" />,
    desc: 'Modelo pequeño ejecutándose en el dispositivo del usuario (terminal, kiosco, smartphone).',
    pros: ['Sin latencia de red', 'Funciona offline', 'Máxima privacidad', 'Sin coste por token'],
    cons: ['Modelos limitados', 'Hardware dependiente', 'Actualizaciones complejas', 'No tareas complejas'],
    bestFor: 'Funciones simples, entornos sin conectividad',
    ctrl: 90, lat: 95, cost: 68, priv: 100, scale: 30
  },
  {
    id: 'hybrid',
    name: 'Híbrido',
    icon: <Workflow className="w-5 h-5" />,
    desc: 'Routing estratégico: datos sensibles en privado/edge, tareas complejas en API anonimizada.',
    pros: ['Optimización coste-privacidad', 'Routing inteligente', 'Resiliente a fallos', 'Flexible'],
    cons: ['Complejidad operativa', 'Dos sistemas', 'Testing complejo', 'Lógica de routing'],
    bestFor: 'Casos mixtos, volumen variable, requisitos cruzados',
    ctrl: 60, lat: 75, cost: 62, priv: 72, scale: 80
  }
];

const PROVIDERS = [
  { id: 'gpt4o', name: 'GPT-4o', org: 'OpenAI', col: COLORS.em, inp: 2.50, cac: 1.25, out: 10.00, bat: 0.50, fixed: 0, note: 'SOTA · máxima capacidad' },
  { id: 'mini', name: 'GPT-4o mini', org: 'OpenAI', col: COLORS.sky, inp: 0.15, cac: 0.075, out: 0.60, bat: 0.50, fixed: 0, note: 'Eficiente · tareas ligeras' },
  { id: 'llama', name: 'Llama 3.3 70B', org: 'Meta (self-hosted)', col: COLORS.purple, inp: 0.59, cac: 0.30, out: 0.79, bat: 0.30, fixed: 0, note: 'Open-weight · control total' },
  { id: 'ptu', name: 'Azure PTU', org: 'Microsoft', col: COLORS.amber, inp: 0, cac: 0, out: 0, bat: 0, fixed: 3200, note: 'Capacidad reservada · SLA' }
];

const RISKS = [
  { id: 'pii', cat: 'Privacidad', sev: 'Crítico', name: 'Exposición de PII/PHI', prob: 'Media', impact: 'Muy alto', mit: 'Anonimización, despliegue privado, DPA, cifrado E2E' },
  { id: 'lock', cat: 'Estrategia', sev: 'Alto', name: 'Vendor lock-in profundo', prob: 'Alta', impact: 'Alto', mit: 'Multi-proveedor, open-weight fallback, abstracción API' },
  { id: 'hallu', cat: 'Calidad', sev: 'Alto', name: 'Alucinaciones / Errores factuales', prob: 'Alta', impact: 'Alto', mit: 'RAG, human-in-the-loop, evaluación continua' },
  { id: 'cost_drift', cat: 'Finanzas', sev: 'Medio', name: 'Desbordamiento de coste', prob: 'Media', impact: 'Medio', mit: 'Rate limiting, alertas, hard cap mensual' },
  { id: 'lat', cat: 'Operativo', sev: 'Alto', name: 'Latencia fuera de SLA', prob: 'Baja', impact: 'Alto', mit: 'Caching, batch, CDN, reserva capacidad' },
  { id: 'comply', cat: 'Legal', sev: 'Crítico', name: 'Incumplimiento regulatorio', prob: 'Baja', impact: 'Muy alto', mit: 'DPO review, auditoría, clasificación AI Act' },
  { id: 'human', cat: 'Gobernanza', sev: 'Alto', name: 'Over-reliance sin validación', prob: 'Alta', impact: 'Alto', mit: 'Diseño HITL, confidence thresholds, formación' },
  { id: 'obs', cat: 'Técnico', sev: 'Medio', name: 'Falta de observabilidad', prob: 'Alta', impact: 'Medio', mit: 'MLOps pipeline, monitoring, alertas drift' }
];

const EXAMPLES: Record<string, any[]> = {
  health: [
    { layer: 'Estratégica', decision: '¿Desplegar en urgencias o consultas primero?', data: 'Tasa error codificación, coste por proceso', source: 'HIS, SAP Salud', frequency: 'Mensual', owner: 'Dirección Médica', kpi: 'Reducción tiempo doc ≥30%', risk: 'Inversión sin ROI' },
    { layer: 'Táctica', decision: '¿Qué especialidades priorizar?', data: 'Volumen, tasa error, tiempo medio informe', source: 'CMBD, Urgencias', frequency: 'Semanal', owner: 'Jefe de Servicio', kpi: 'Precisión CIE-10 >95%', risk: 'Selección incorrecta' },
    { layer: 'Operativa', decision: '¿Aprobar o corregir el resumen?', data: 'Output modelo, historia clínica completa', source: 'LLM + HIS real-time', frequency: 'Tiempo real', owner: 'Médico', kpi: 'Revisión <2 min · Aceptación >80%', risk: 'Error clínico' }
  ],
  devtools: [
    { layer: 'Estratégica', decision: '¿Build vs Buy: Copiloto propio o GitHub?', data: 'Uso actual, coste build, diferenciación', source: 'Analytics, encuestas', frequency: 'Mensual', owner: 'CTO', kpi: 'Time-to-first-value <1h', risk: 'Coste sin diferenciación' },
    { layer: 'Táctica', decision: '¿Qué funciones priorizar en roadmap?', data: 'Frecuencia uso, NPS segmento, coste soporte', source: 'Mixpanel, Zendesk', frequency: 'Semanal', owner: 'Product Manager', kpi: 'Reducción tickets 25%', risk: 'Bajo impacto real' },
    { layer: 'Operativa', decision: '¿Aceptar sugerencia o modificar?', data: 'Sugerencia + contexto código', source: 'IDE extension API', frequency: 'Tiempo real', owner: 'Dev', kpi: 'Aceptación >40% · Latencia <500ms', risk: 'Código incorrecto' }
  ],
  banking: [
    { layer: 'Estratégica', decision: '¿Chatbot regulatorio o Detección Fraude?', data: 'Volumen consultas, pérdidas fraude', source: 'CRM, Core, Compliance', frequency: 'Mensual', owner: 'Comité Digital', kpi: 'Reducción coste/interacción ≥40%', risk: 'Alineación insuficiente' },
    { layer: 'Táctica', decision: '¿Qué tipologías automatizar primero?', data: 'Clasificación consultas, tasa resolución', source: 'CRM, tickets', frequency: 'Semanal', owner: 'Director Ops', kpi: 'Deflexión >65%', risk: 'Automatizar juicio humano' },
    { layer: 'Operativa', decision: '¿Aprobar verificación o escalar?', data: 'Doc escaneado + metadata + historial', source: 'OCR + LLM + Core', frequency: 'Tiempo real', owner: 'Gestor', kpi: 'FP rate <0.5% · Tiempo <30s', risk: 'Fraude no detectado' }
  ],
  retail: [
    { layer: 'Estratégica', decision: '¿Previsión demanda o Asistente almacén?', data: 'Impacto rotura stock vs tiempo búsqueda', source: 'ERP SAP, P&L', frequency: 'Mensual', owner: 'Director Ops', kpi: 'Reducción rotura stock ≥30%', risk: 'Bajo ROI inicial' },
    { layer: 'Táctica', decision: '¿Qué categorías incluir en modelo inicial?', data: 'Histórico ventas, estacionalidad, rotación', source: 'SAP BW, POS', frequency: 'Semanal', owner: 'Planning', kpi: 'MAPE <12%', risk: 'Datos baja calidad' },
    { layer: 'Operativa', decision: '¿Qué ubicación de picking recomienda?', data: 'Consulta operario + stock + distribución', source: 'WMS + LLM', frequency: 'Tiempo real', owner: 'Operario', kpi: 'Tiempo picking -20% · Error <0.5%', risk: 'Picking incorrecto' }
  ]
};

const MODS = [
  'Inicio',
  'Brief del Caso',
  'Mapa de Decisiones',
  'Arquitectura',
  'Economía del Cómputo',
  'Riesgo & Gobernanza',
  'Brief Ejecutivo'
];

// --- Components ---

const ModuleHeader = ({ icon: Icon, title, step, total, session }: { icon: any; title: string; step: number; total: number; session?: string }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Módulo {step + 1} / {total}</p>
        </div>
      </div>
      {session && (
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono border ${session === 'S5' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
          SESIÓN {session}
        </div>
      )}
    </div>
  </div>
);

const Prompt = ({ text }: { text: string }) => (
  <div className="bg-indigo-500/5 border-l-2 border-indigo-500 p-4 mb-6 rounded-r-lg">
    <div className="flex items-start gap-3">
      <Info size={16} className="text-indigo-400 mt-0.5 shrink-0" />
      <p className="text-sm text-slate-300 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  </div>
);

const Card = ({ children, color, className = "" }: { children: React.ReactNode; color?: string; className?: string; key?: any }) => (
  <div 
    className={`bg-slate-900/50 border border-slate-800 rounded-xl p-5 ${className}`}
    style={color ? { borderLeft: `3px solid ${color}` } : {}}
  >
    {children}
  </div>
);

const Label = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-3 uppercase" style={color ? { color } : {}}>
    {children}
  </div>
);

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[10px] font-mono text-slate-400">{label}</span>
      <span className="text-[10px] font-mono font-bold" style={{ color }}>{value}%</span>
    </div>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [step, setStep] = useState(0);
  const [selectedCaseId, setSelectedCaseId] = useState('health');
  const [decisions, setDecisions] = useState(['', '', '']);
  const [assumptions, setAssumptions] = useState(['', '', '']);
  const [board, setBoard] = useState(() => 
    ['Estratégica', 'Táctica', 'Operativa'].map(l => ({
      layer: l, decision: '', data: '', source: '', frequency: 'Mensual', owner: '', kpi: '', risk: ''
    }))
  );
  const [selectedArchId, setSelectedArchId] = useState('saas');
  const [selectedRiskIds, setSelectedRiskIds] = useState<string[]>([]);

  const currentCase = useMemo(() => CASES.find(c => c.id === selectedCaseId)!, [selectedCaseId]);
  const currentArch = useMemo(() => ARCHS.find(a => a.id === selectedArchId)!, [selectedArchId]);

  // Module 4 State
  const [users, setUsers] = useState(currentCase.users);
  const [freq, setFreq] = useState(currentCase.freq);
  const [avgTok, setAvgTok] = useState(1200);
  const [outR, setOutR] = useState(30);
  const [cacR, setCacR] = useState(25);
  const [batR, setBatR] = useState(20);

  useEffect(() => {
    setUsers(currentCase.users);
    setFreq(currentCase.freq);
  }, [selectedCaseId]);

  const costs = useMemo(() => {
    const mTok = users * freq * avgTok;
    const inpTok = mTok * (1 - outR / 100);
    const outTok = mTok * (outR / 100);
    const cacTok = inpTok * (cacR / 100);
    const batTok = mTok * (batR / 100);

    return PROVIDERS.map(p => {
      if (p.id === 'ptu') return { ...p, cost: p.fixed };
      const inp = ((inpTok - cacTok) / 1e6) * p.inp;
      const cac = (cacTok / 1e6) * p.cac;
      const out = (outTok / 1e6) * p.out;
      const bat = (batTok / 1e6) * (p.inp * p.bat);
      return { ...p, cost: Math.max(0, inp + cac + out - bat) };
    });
  }, [users, freq, avgTok, outR, cacR, batR]);

  const minCost = Math.min(...costs.map(c => c.cost));
  const maxCost = Math.max(...costs.map(c => c.cost));

  const completenessScore = useMemo(() => {
    const cd = decisions.filter(Boolean).length;
    const cb = board.filter(b => b.decision && b.kpi).length;
    const score = Math.round((cd / 3) * 25 + (cb / 3) * 25 + (selectedArchId ? 25 : 0) + (Math.min(selectedRiskIds.length, 3) / 3) * 25);
    return score;
  }, [decisions, board, selectedArchId, selectedRiskIds]);

  const next = () => setStep(s => Math.min(s + 1, 6));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-[#03040f] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#060814]/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">AI DEPLOYMENT LAB</h1>
            <p className="text-[10px] font-mono text-slate-500">SESIONES 5 & 6 · UNIE UNIVERSIDAD</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {MODS.map((_, i) => (
            <button 
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-indigo-500 w-6' : i < step ? 'bg-indigo-500/40' : 'bg-slate-800'}`}
            />
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="text-center py-12">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="mb-6 inline-block p-4 rounded-2xl bg-indigo-500/10 text-indigo-400"
                >
                  <Workflow size={48} />
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Diseñar sistemas de IA como un consultor real</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
                  Una actividad de simulación profesional para Diseño de Sistemas de Información. 
                  De la decisión de negocio a la arquitectura de cómputo.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <Card color={COLORS.ind}>
                    <div className="text-2xl font-bold text-indigo-400 mb-1">Sesión 5</div>
                    <div className="text-sm font-bold mb-2">Información para decidir</div>
                    <p className="text-xs text-slate-500 leading-relaxed">Modela qué información necesitas para decidir bien en cada capa organizacional.</p>
                  </Card>
                  <Card color={COLORS.amber}>
                    <div className="text-2xl font-bold text-amber-400 mb-1">Sesión 6</div>
                    <div className="text-sm font-bold mb-2">Gestión del cómputo</div>
                    <p className="text-xs text-slate-500 leading-relaxed">Simula costes, latencia y arquitectura de despliegue con datos reales.</p>
                  </Card>
                  <Card color={COLORS.em}>
                    <div className="text-2xl font-bold text-emerald-400 mb-1">∑ Integrador</div>
                    <div className="text-sm font-bold mb-2">Brief Ejecutivo</div>
                    <p className="text-xs text-slate-500 leading-relaxed">Genera un entregable defendible ante dirección con todos los artefactos.</p>
                  </Card>
                </div>

                <button 
                  onClick={next}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 mx-auto"
                >
                  Comenzar Taller <ChevronRight size={18} />
                </button>
              </div>
            )}

            {step === 1 && (
              <div>
                <ModuleHeader icon={Briefcase} title="Brief del Caso" step={step} total={7} session="S5" />
                <Prompt text="Eres consultor/a de IA. Antes de diseñar cualquier solución debes <strong>comprender el caso en profundidad</strong>. Selecciona un sector e identifica las restricciones clave." />
                
                <Label>Selecciona tu sector</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {CASES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${selectedCaseId === c.id ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
                    >
                      <div className="text-2xl mb-2">{c.icon}</div>
                      <div className="text-[10px] font-mono font-bold mb-1" style={{ color: c.col }}>{c.sector.toUpperCase()}</div>
                      <div className="text-xs font-bold text-slate-200 leading-tight">{c.title}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card color={currentCase.col}>
                      <Label>Contexto de la Organización</Label>
                      <p className="text-sm text-slate-300 leading-relaxed mb-4">{currentCase.org}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { l: 'Usuarios', v: currentCase.users.toLocaleString() },
                          { l: 'Presupuesto', v: `€${currentCase.budget.toLocaleString()}` },
                          { l: 'Latencia', v: currentCase.latency },
                          { l: 'Sensibilidad', v: currentCase.sensitivity }
                        ].map(s => (
                          <div key={s.l}>
                            <div className="text-[10px] font-mono text-slate-500 mb-1">{s.l.toUpperCase()}</div>
                            <div className="text-xs font-bold text-indigo-400">{s.v}</div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card color={COLORS.red}>
                      <Label color={COLORS.red}>Restricciones & Regulación</Label>
                      <div className="text-xs font-mono text-red-400 mb-4 bg-red-500/5 p-2 rounded border border-red-500/20">
                        {currentCase.regulatory}
                      </div>
                      <ul className="space-y-2">
                        {currentCase.constraints.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <ChevronRight size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card color={COLORS.ind}>
                      <Label color={COLORS.ind}>Decisiones Críticas</Label>
                      <p className="text-[10px] text-slate-500 mb-4">Formula las 3 preguntas clave que guiarán tu consultoría.</p>
                      {[0, 1, 2].map(i => (
                        <div key={i} className="mb-4 last:mb-0">
                          <input 
                            value={decisions[i]}
                            onChange={e => {
                              const d = [...decisions];
                              d[i] = e.target.value;
                              setDecisions(d);
                            }}
                            placeholder={`Decisión ${i + 1}...`}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      ))}
                    </Card>
                    <Card color={COLORS.amber}>
                      <Label color={COLORS.amber}>Supuestos de Partida</Label>
                      {[0, 1, 2].map(i => (
                        <div key={i} className="mb-4 last:mb-0">
                          <input 
                            value={assumptions[i]}
                            onChange={e => {
                              const a = [...assumptions];
                              a[i] = e.target.value;
                              setAssumptions(a);
                            }}
                            placeholder={`Supuesto ${i + 1}...`}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                      ))}
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <ModuleHeader icon={Layers} title="Mapa de Decisiones" step={step} total={7} session="S5" />
                <Prompt text="NÚCLEO S5. Identifica qué se decide, con qué dato y cómo medimos el éxito. <strong>Sin este mapa, el despliegue de IA no tiene fundamento.</strong>" />
                
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => setBoard(EXAMPLES[selectedCaseId].map(r => ({ ...r })))}
                    className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                  >
                    Cargar ejemplo de referencia <ChevronRight size={12} />
                  </button>
                </div>

                <div className="space-y-6">
                  {board.map((row, ri) => (
                    <Card 
                      key={ri} 
                      color={row.layer === 'Estratégica' ? COLORS.purple : row.layer === 'Táctica' ? COLORS.amber : COLORS.em}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.layer === 'Estratégica' ? COLORS.purple : row.layer === 'Táctica' ? COLORS.amber : COLORS.em }} />
                        <span className="text-xs font-bold uppercase tracking-wider">{row.layer}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { k: 'decision', l: 'Decisión', ph: '¿Qué se decide?' },
                          { k: 'data', l: 'Dato necesario', ph: 'Información requerida' },
                          { k: 'source', l: 'Fuente', ph: 'Origen del dato' },
                          { k: 'frequency', l: 'Frecuencia', type: 'select', opts: ['Tiempo real', 'Horaria', 'Diaria', 'Semanal', 'Mensual'] },
                          { k: 'owner', l: 'Responsable', ph: 'Owner de la decisión' },
                          { k: 'kpi', l: 'KPI de éxito', ph: 'Métrica de mejora' }
                        ].map(f => (
                          <div key={f.k}>
                            <div className="text-[9px] font-mono text-slate-500 mb-1 uppercase">{f.l}</div>
                            {f.type === 'select' ? (
                              <select 
                                value={row[f.k as keyof typeof row]}
                                onChange={e => {
                                  const b = [...board];
                                  (b[ri] as any)[f.k] = e.target.value;
                                  setBoard(b);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                              >
                                {f.opts?.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            ) : (
                              <input 
                                value={row[f.k as keyof typeof row]}
                                onChange={e => {
                                  const b = [...board];
                                  (b[ri] as any)[f.k] = e.target.value;
                                  setBoard(b);
                                }}
                                placeholder={f.ph}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <ModuleHeader icon={Cpu} title="Arquitectura de Despliegue" step={step} total={7} session="S5" />
                <Prompt text="Elige el patrón de despliegue que mejor encaje con las restricciones del caso: <strong>latencia, sensibilidad del dato y presupuesto.</strong>" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  {ARCHS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedArchId(a.id)}
                      className={`p-4 rounded-xl border text-center transition-all ${selectedArchId === a.id ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
                    >
                      <div className={`mx-auto mb-3 p-2 rounded-lg w-fit ${selectedArchId === a.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {a.icon}
                      </div>
                      <div className="text-[10px] font-bold text-slate-200 leading-tight">{a.name}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Card color={COLORS.ind}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-indigo-500 text-white">
                          {currentArch.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100">{currentArch.name}</h3>
                          <p className="text-[10px] text-slate-500">{currentArch.bestFor}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6">{currentArch.desc}</p>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label color={COLORS.em}>Ventajas</Label>
                          <ul className="space-y-2">
                            {currentArch.pros.map(p => (
                              <li key={p} className="text-xs text-slate-400 flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-emerald-500" /> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <Label color={COLORS.red}>Limitaciones</Label>
                          <ul className="space-y-2">
                            {currentArch.cons.map(p => (
                              <li key={p} className="text-xs text-slate-400 flex items-center gap-2">
                                <AlertTriangle size={12} className="text-red-500" /> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <Label>Radar de Características</Label>
                      <StatBar label="Control del dato" value={currentArch.ctrl} color={COLORS.ind} />
                      <StatBar label="Latencia" value={currentArch.lat} color={COLORS.cyan} />
                      <StatBar label="Rentabilidad" value={currentArch.cost} color={COLORS.em} />
                      <StatBar label="Privacidad" value={currentArch.priv} color={COLORS.purple} />
                      <StatBar label="Escalabilidad" value={currentArch.scale} color={COLORS.amber} />
                    </Card>

                    <Card color={COLORS.amber}>
                      <Label color={COLORS.amber}>Encaje con el Caso</Label>
                      <div className="space-y-3">
                        {[
                          { l: `Sensibilidad: ${currentCase.sensitivity}`, ok: currentArch.priv > 60, v: currentArch.priv > 60 ? 'Encaja' : 'Riesgo' },
                          { l: `Latencia: ${currentCase.latency}`, ok: currentArch.lat > 65, v: currentArch.lat > 65 ? 'Encaja' : 'Revisar' },
                          { l: `Presupuesto: €${currentCase.budget.toLocaleString()}`, ok: currentArch.cost > 50, v: currentArch.cost > 50 ? 'Posible' : 'Ajustado' }
                        ].map(c => (
                          <div key={c.l} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                            <span className="text-[10px] text-slate-400 font-mono">{c.l}</span>
                            <span className={`text-[10px] font-mono font-bold ${c.ok ? 'text-emerald-400' : 'text-amber-400'}`}>{c.v}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <ModuleHeader icon={BarChart3} title="Economía del Cómputo" step={step} total={7} session="S6" />
                <Prompt text="NÚCLEO S6. Desplegar IA es gestionar <strong>coste por token, caching y batch.</strong> Ajusta los parámetros y observa cómo varía el coste mensual." />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <Label>Simulador de Demanda</Label>
                    <div className="space-y-6">
                      {[
                        { l: 'Usuarios activos/mes', v: users, s: setUsers, min: 100, max: 300000, step: 500 },
                        { l: 'Consultas/usuario/mes', v: freq, s: setFreq, min: 1, max: 500, step: 1 },
                        { l: 'Tokens promedio/consulta', v: avgTok, s: setAvgTok, min: 200, max: 16000, step: 100 },
                        { l: 'Ratio output tokens (%)', v: outR, s: setOutR, min: 10, max: 70, step: 5 },
                        { l: 'Ratio caché (%)', v: cacR, s: setCacR, min: 0, max: 80, step: 5 },
                        { l: 'Ratio batch (%)', v: batR, s: setBatR, min: 0, max: 70, step: 5 }
                      ].map(sl => (
                        <div key={sl.l}>
                          <div className="flex justify-between mb-2">
                            <span className="text-[10px] font-mono text-slate-500">{sl.l.toUpperCase()}</span>
                            <span className="text-[10px] font-mono font-bold text-indigo-400">{sl.v.toLocaleString()}</span>
                          </div>
                          <input 
                            type="range"
                            min={sl.min}
                            max={sl.max}
                            step={sl.step}
                            value={sl.v}
                            onChange={e => sl.s(Number(e.target.value))}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="space-y-6">
                    <Card color={COLORS.ind}>
                      <Label color={COLORS.ind}>Coste Mensual Estimado</Label>
                      <div className="space-y-4">
                        {costs.map(p => (
                          <div key={p.id}>
                            <div className="flex justify-between items-end mb-1">
                              <div>
                                <span className="text-xs font-bold text-slate-200">{p.name}</span>
                                <span className="text-[9px] text-slate-500 ml-2">{p.org}</span>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-mono font-bold ${p.cost === minCost ? 'text-emerald-400' : 'text-slate-200'}`}>
                                  €{p.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </div>
                                {p.cost === minCost && <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Opción más barata</div>}
                              </div>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(p.cost / maxCost) * 100}%` }}
                                className="h-full"
                                style={{ backgroundColor: p.col }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card color={COLORS.cyan}>
                      <Label color={COLORS.cyan}>Reflexión Estratégica</Label>
                      <ul className="space-y-3">
                        {[
                          '¿Cuándo conviene capacidad reservada (PTU) vs pay-as-you-go?',
                          '¿Qué parte del flujo puede ir a batch y cuál requiere tiempo real?',
                          '¿Qué contexto puede cachearse para reducir coste?'
                        ].map((q, i) => (
                          <li key={i} className="text-[10px] text-slate-400 leading-relaxed flex gap-2">
                            <Zap size={10} className="text-cyan-400 shrink-0 mt-0.5" /> {q}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <ModuleHeader icon={ShieldAlert} title="Riesgo & Gobernanza" step={step} total={7} session="S6" />
                <Prompt text="Selecciona los riesgos relevantes para tu caso. <strong>Evalúa si las mitigaciones son suficientes</strong> dado el marco regulatorio específico." />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RISKS.map(r => {
                    const active = selectedRiskIds.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRiskIds(prev => prev.includes(r.id) ? prev.filter(id => id !== r.id) : [...prev, r.id])}
                        className={`text-left p-4 rounded-xl border transition-all ${active ? 'bg-red-500/10 border-red-500/50' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2">
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${r.sev === 'Crítico' ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'}`}>
                              {r.sev.toUpperCase()}
                            </span>
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              {r.cat.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[8px] font-mono text-slate-500">
                            Impacto: <span className="text-slate-300">{r.impact}</span>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-slate-200 mb-2">{r.name}</div>
                        <div className="text-[10px] text-slate-500 leading-relaxed">
                          <span className="text-emerald-500/70 font-bold">Mitigación:</span> {r.mit}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <ModuleHeader icon={FileText} title="Brief Ejecutivo" step={step} total={7} session="S6" />
                <Prompt text="Tu entregable final. Sintetiza el análisis para presentar ante dirección. <strong>Un buen brief es concreto, defendible y orientado a decisión.</strong>" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8 bg-white text-slate-900 p-10 rounded-2xl shadow-2xl font-serif">
                    <div className="border-b-2 border-slate-900 pb-6 mb-8">
                      <div className="text-[10px] font-mono font-bold text-indigo-600 mb-2 uppercase tracking-widest">Executive Brief · AI Deployment Lab</div>
                      <h2 className="text-3xl font-bold mb-2">{currentCase.title}</h2>
                      <p className="text-slate-600 italic">{currentCase.org}</p>
                    </div>

                    <section className="mb-8">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">A · Decisiones Críticas</h3>
                      <ul className="space-y-3">
                        {decisions.filter(Boolean).map((d, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="font-mono font-bold text-indigo-600">{i + 1}.</span>
                            <span className="text-sm leading-relaxed">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">B · Arquitectura Recomendada</h3>
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-indigo-600">{currentArch.icon}</div>
                          <div className="text-lg font-bold">{currentArch.name}</div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                          Seleccionada por su equilibrio entre {currentArch.priv > 60 ? 'privacidad de dato' : 'optimización de coste'} y {currentArch.lat > 70 ? 'cumplimiento de latencia' : 'escalabilidad'}.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {currentArch.pros.map(p => (
                            <span key={p} className="text-[9px] font-mono font-bold bg-white border border-slate-200 px-2 py-1 rounded">{p.toUpperCase()}</span>
                          ))}
                        </div>
                      </div>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">C · Mapa de Trazabilidad</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[10px] border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-2 font-bold uppercase">Capa</th>
                              <th className="text-left py-2 font-bold uppercase">Decisión</th>
                              <th className="text-left py-2 font-bold uppercase">KPI</th>
                            </tr>
                          </thead>
                          <tbody>
                            {board.map((b, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0">
                                <td className="py-3 font-bold text-indigo-600">{b.layer}</td>
                                <td className="py-3 pr-4">{b.decision || '—'}</td>
                                <td className="py-3 font-bold">{b.kpi || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">D · Riesgos & Mitigación</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {RISKS.filter(r => selectedRiskIds.includes(r.id)).map(r => (
                          <div key={r.id} className="text-[10px] leading-relaxed">
                            <div className="font-bold mb-1">• {r.name}</div>
                            <div className="text-slate-500 italic">Mitigación: {r.mit}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <Card color={completenessScore >= 75 ? COLORS.em : completenessScore >= 50 ? COLORS.amber : COLORS.red}>
                      <Label>Score de Completitud</Label>
                      <div className="text-5xl font-bold mb-2" style={{ color: completenessScore >= 75 ? COLORS.em : completenessScore >= 50 ? COLORS.amber : COLORS.red }}>
                        {completenessScore}%
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${completenessScore}%` }}
                          className="h-full"
                          style={{ backgroundColor: completenessScore >= 75 ? COLORS.em : completenessScore >= 50 ? COLORS.amber : COLORS.red }}
                        />
                      </div>
                      <ul className="space-y-2">
                        {[
                          { l: 'Decisiones críticas', ok: decisions.filter(Boolean).length === 3 },
                          { l: 'Mapa Decisión→KPI', ok: board.filter(b => b.decision && b.kpi).length === 3 },
                          { l: 'Arquitectura elegida', ok: !!selectedArchId },
                          { l: 'Riesgos analizados', ok: selectedRiskIds.length >= 3 }
                        ].map(c => (
                          <li key={c.l} className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">{c.l}</span>
                            <span className={c.ok ? 'text-emerald-500' : 'text-red-500'}>{c.ok ? '✓' : '✗'}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <button 
                      onClick={() => window.print()}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={18} /> Exportar PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      {step > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-[#060814]/90 backdrop-blur-md border-t border-slate-800/50 px-6 py-4 flex items-center justify-between">
          <button 
            onClick={prev}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} /> Anterior
          </button>
          
          <div className="hidden md:flex items-center gap-4">
            {MODS.map((m, i) => (
              <div 
                key={i}
                className={`text-[9px] font-mono font-bold tracking-tighter transition-colors ${i === step ? 'text-indigo-400' : i < step ? 'text-indigo-400/40' : 'text-slate-700'}`}
              >
                {i + 1}. {m.toUpperCase()}
              </div>
            ))}
          </div>

          <button 
            onClick={next}
            disabled={step === 6}
            className={`flex items-center gap-2 text-sm font-bold transition-all ${step === 6 ? 'opacity-0 pointer-events-none' : 'text-indigo-400 hover:text-indigo-300'}`}
          >
            Siguiente <ChevronRight size={18} />
          </button>
        </footer>
      )}
    </div>
  );
}

import React from "react";
import {
  learnedPatterns,
  mainPageSections,
  projectFileMap,
  projectHistory,
  recurringFunctions,
} from "../../data/projectKnowledge";
import { GlassCard, SectionTitle, SectionWave } from "../Primitives";

const visibleFileMap = projectFileMap.slice(0, 6);
const visibleFunctions = recurringFunctions.slice(0, 5);
const visibleSections = mainPageSections.slice(0, 9);

const ProjectDocumentation: React.FC = () => (
  <SectionWave className="bg-white/80">
    <div className="mx-auto max-w-6xl px-6">
      <SectionTitle label="Documentacao do projeto" />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-5">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="card-title">Historico</p>
                <p className="card-text">Registro das mudancas relevantes para futuras sessoes.</p>
              </div>
              <span className="rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-white">
                {projectHistory.length} eventos
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {projectHistory.map((entry) => (
                <article key={`${entry.date}-${entry.title}`} className="rounded-xl bg-white/70 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">{entry.date}</p>
                  <h3 className="mt-1 text-base font-semibold text-neutral-900">{entry.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{entry.summary}</p>
                </article>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="card-title">Aprendizado de padroes</p>
            <p className="card-text">Regras observadas no codigo para orientar proximas alteracoes.</p>
            <div className="mt-4 space-y-3">
              {learnedPatterns.map((item) => (
                <div key={item.pattern} className="rounded-xl border border-white/70 bg-white/60 p-4">
                  <p className="text-sm font-semibold text-neutral-900">{item.pattern}</p>
                  <p className="mt-1 text-xs font-semibold text-primary-700">{item.where}</p>
                  <p className="mt-2 text-sm text-neutral-600">{item.rule}</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-900">{item.nextAction}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-5">
          <GlassCard className="p-5">
            <p className="card-title">Mapa de arquivos</p>
            <p className="card-text">Onde encontrar os principais pontos de manutencao.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {visibleFileMap.map((item) => (
                <div key={item.path} className="rounded-xl bg-white/70 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">{item.area}</p>
                  <p className="mt-1 break-words font-mono text-xs font-semibold text-neutral-900">{item.path}</p>
                  <p className="mt-2 text-sm text-neutral-600">{item.purpose}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="card-title">Funcoes recorrentes</p>
            <p className="card-text">Funcoes reutilizadas que concentram comportamento importante.</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/70 bg-white/70">
              {visibleFunctions.map((item, index) => (
                <div
                  key={item.name}
                  className={`grid gap-2 p-4 md:grid-cols-[170px_minmax(0,1fr)] ${
                    index > 0 ? "border-t border-white" : ""
                  }`}
                >
                  <div>
                    <p className="font-mono text-sm font-semibold text-neutral-900">{item.name}</p>
                    <p className="break-words font-mono text-xs text-primary-700">{item.path}</p>
                  </div>
                  <p className="text-sm text-neutral-600">{item.responsibility}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="mt-5 p-5">
        <p className="card-title">Sessoes existentes na pagina principal</p>
        <p className="card-text">Inventario das secoes renderizadas por HomePage e suas fontes de conteudo.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {visibleSections.map((section) => (
            <article key={section.id} className="rounded-xl bg-white/70 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900">{section.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{section.role}</p>
              <p className="mt-3 break-words font-mono text-xs text-primary-700">{section.contentSource}</p>
            </article>
          ))}
        </div>
      </GlassCard>
    </div>
  </SectionWave>
);

export default ProjectDocumentation;

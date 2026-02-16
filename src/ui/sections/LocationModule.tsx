import React from "react";
import { SectionWave } from "../Primitives";

const LocationModule: React.FC = () => (
  <SectionWave className="bg-gradient-to-b from-surface-100 to-white">
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-3xl bg-[#FFF7D6] p-6 shadow-sm md:p-8">
        <h3 className="text-xl font-bold text-neutral-900 md:text-2xl">Atendimento Presencial na Barra da Tijuca</h3>
        <p className="mt-4 whitespace-pre-line text-base text-neutral-900">
          {"📍 Shopping DownTown — Av. das Américas, 500\nBl 16, Sala 108 — Barra da Tijuca, Rio de Janeiro"}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://www.google.com/maps?q=Shopping%20DownTown%20-%20Av.%20das%20Am%C3%A9ricas,%20500%20-%20Bl%2016,%20Sala%20108%20-%20Barra%20da%20Tijuca,%20Rio%20de%20Janeiro%20-%20RJ"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:brightness-95"
          >
            Abrir no Google Maps
          </a>
          <a
            href="https://www.waze.com/ul?q=Shopping%20DownTown%2C%20Av.%20das%20Am%C3%A9ricas%2C%20500%20-%20Bl%2016%2C%20Sala%20108%20-%20Barra%20da%20Tijuca%2C%20Rio%20de%20Janeiro%20-%20RJ&navigate=yes"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Abrir no Waze
          </a>
        </div>
        <p className="mt-5 text-sm font-medium text-neutral-700">🕒 Atendimento de segunda a sexta, das 9h às 19h</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.695092417619!2d-43.36284872513852!3d-22.9735981402326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bdba28f0f93b1%3A0x5cf52abdfb8f3a48!2sDowntown!5e0!3m2!1spt-BR!2sbr!4v1699394754012!5m2!1spt-BR!2sbr"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "12px", marginTop: "30px" }}
          allowFullScreen
          loading="lazy"
          title="Mapa Shopping DownTown"
        />
      </div>
    </div>
  </SectionWave>
);

export default LocationModule;

import React from "react";
import { CTAButton, GlassCard, SectionTitle, SectionWave } from "./ui/Primitives.js";
import { EBOOKS, EBOOK_CATEGORIES, EbookCategory } from "./data/ebooks.js";

type Props = {
  onNavigateHome: () => void;
};

const meta = {
  title: "Catálogo de Ebooks | Nutrição Acolhedora por Thais Paganini",
  description:
    "Catálogo premium de ebooks com foco em emagrecimento leve, receitas práticas, hipertrofia feminina e rotina sem ansiedade alimentar.",
};

const toggleSetValue = (current: Set<EbookCategory>, category: EbookCategory) => {
  const next = new Set(current);
  if (next.has(category)) {
    next.delete(category);
  } else {
    next.add(category);
  }
  return next;
};

const useSeoMetadata = () => {
  React.useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute("content") ?? "";

    document.title = meta.title;
    if (descriptionTag) {
      descriptionTag.setAttribute("content", meta.description);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.setAttribute("name", "description");
      newMeta.setAttribute("content", meta.description);
      document.head.appendChild(newMeta);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, []);
};

const categoryStyles =
  "rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-700/30";

const EbooksPage: React.FC<Props> = ({ onNavigateHome }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<Set<EbookCategory>>(new Set());
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  useSeoMetadata();

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredEbooks = React.useMemo(
    () =>
      EBOOKS.filter((ebook) => {
        const matchesCategory =
          selectedCategories.size === 0 || selectedCategories.has(ebook.category);
        const matchesSearch =
          normalizedSearch.length === 0 ||
          ebook.title.toLowerCase().includes(normalizedSearch) ||
          ebook.description.toLowerCase().includes(normalizedSearch);

        return matchesCategory && matchesSearch;
      }),
    [normalizedSearch, selectedCategories],
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearch, selectedCategories, itemsPerPage]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredEbooks.length / itemsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredEbooks.length, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredEbooks.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEbooks = filteredEbooks.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryClick = (category: EbookCategory) => {
    setSelectedCategories((prev) => toggleSetValue(prev, category));
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSearchTerm("");
    setItemsPerPage(10);
  };

  const pageNumbers = filteredEbooks.length > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [];

  return (
    <div className="bg-surface-100 text-neutral-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700/80 via-peach-500/70 to-surface-200/90 text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.25)), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
          <GlassCard className="max-w-3xl border-white/60 px-8 py-10 text-left text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Ebooks exclusivos da Nutri
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Catálogo de Ebooks para transformar sua rotina
            </h1>
            <p className="mt-3 text-lg text-white/90 md:text-xl">
              Acesse guias práticos, receitas e protocolos que reduzem inchaço, aceleram resultados e
              trazem leveza para o dia a dia.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-white/90">
              <span className="badge-pill bg-white/15 text-white">Atualizado e estratégico</span>
              <span className="badge-pill bg-white/15 text-white">Foco em resultado</span>
              <span className="badge-pill bg-white/15 text-white">Conteúdo direto ao ponto</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTAButton label="Ver catálogo" onClick={() => window.scrollTo({ top: 520, behavior: "smooth" })} />
              <button
                type="button"
                onClick={onNavigateHome}
                className="rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Voltar para página inicial
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      <SectionWave className="bg-white/80">
        <div className="mx-auto max-w-6xl px-6">
          <GlassCard className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex-1 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-700">
                  Filtros inteligentes
                </p>
                <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
                  Encontre o ebook perfeito para seu objetivo
                </h2>
                <p className="text-sm text-neutral-700 md:text-base">
                  Combine categorias, busque por palavra-chave e escolha quantos itens deseja visualizar por página.
                </p>
              </div>
              <div className="flex flex-col gap-2 md:w-60">
                <label htmlFor="items-per-page" className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">
                  Itens por página
                </label>
                <select
                  id="items-per-page"
                  className="rounded-xl border border-neutral-200 bg-white/90 px-4 py-3 text-sm font-semibold text-neutral-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-700/30"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  {[5, 10, 20].map((option) => (
                    <option key={option} value={option}>
                      {option} itens
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">
                  Buscar por palavra-chave
                </label>
                <input
                  type="search"
                  placeholder="Digite título ou benefício do ebook"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white/90 px-4 py-3 text-sm text-neutral-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-700/30"
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">
                  Categorias
                </p>
                <div className="flex flex-wrap gap-2">
                  {EBOOK_CATEGORIES.map((category) => {
                    const isActive = selectedCategories.has(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryClick(category)}
                        className={`${categoryStyles} ${
                          isActive
                            ? "border-primary-600 bg-primary-700/10 text-primary-800 shadow-md"
                            : "border-neutral-200 bg-white/80 text-neutral-800 hover:bg-primary-50/70"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-neutral-700">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-800">
                {filteredEbooks.length} resultado(s)
              </span>
              {selectedCategories.size > 0 && (
                <span className="rounded-full bg-white/70 px-3 py-1 text-neutral-800">
                  Categorias ativas: {Array.from(selectedCategories).join(", ")}
                </span>
              )}
              {(selectedCategories.size > 0 || normalizedSearch.length > 0 || itemsPerPage !== 10) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-primary-800 underline decoration-primary-700/60 underline-offset-2 transition hover:text-primary-900"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </GlassCard>
        </div>
      </SectionWave>

      <SectionWave className="bg-surface-100">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle label="Catálogo estratégico de ebooks" />
          {paginatedEbooks.length === 0 ? (
            <GlassCard className="mt-6 p-6 text-center">
              <p className="text-lg font-semibold text-neutral-900">Nenhum ebook encontrado.</p>
              <p className="mt-2 text-sm text-neutral-700">
                Ajuste os filtros ou a busca para encontrar a solução ideal para seu momento.
              </p>
              <div className="mt-4">
                <CTAButton label="Ver todos novamente" onClick={clearFilters} />
              </div>
            </GlassCard>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedEbooks.map((ebook) => (
                <a
                  key={ebook.id}
                  href={ebook.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card group flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/80 transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-700/40"
                >
                  <div className="relative">
                    <img
                      src={ebook.cover}
                      alt={ebook.alt}
                      loading="lazy"
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="badge-pill bg-white/80 text-xs font-semibold text-primary-800">
                        {ebook.category}
                      </span>
                      {ebook.highlight && (
                        <span className="badge-pill bg-primary-700 text-xs font-semibold text-white">
                          {ebook.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-lg font-bold text-neutral-900">{ebook.title}</h3>
                    <p className="card-text flex-1 text-sm text-neutral-700">{ebook.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary-800">Acessar ebook</span>
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-800 transition group-hover:bg-primary-700 group-hover:text-white"
                        aria-hidden
                      >
                        ↗
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {pageNumbers.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Anterior
              </button>
              <div className="flex flex-wrap justify-center gap-2">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-700/30 ${
                      currentPage === page
                        ? "bg-primary-700 text-white shadow-lg"
                        : "border border-neutral-200 bg-white/80 text-neutral-800 hover:bg-primary-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </SectionWave>
    </div>
  );
};

export default EbooksPage;

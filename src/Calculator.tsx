import React from "react";

const STORAGE_KEY = "bodyFatCalculatorState";

type Sex = "female" | "male";

type Measurements = {
  height: string;
  waist: string;
  hip: string;
  neck: string;
  abdomen: string;
};

type Result = {
  value: number;
  classification: string;
};

type FieldConfig = {
  id: keyof Measurements;
  label: string;
  helper?: string;
  placeholder?: string;
};

const femaleFields: FieldConfig[] = [
  {
    id: "height",
    label: "Altura (cm)",
    helper: "Use sua altura total, descalça.",
    placeholder: "Ex.: 165",
  },
  {
    id: "waist",
    label: "Circunferência da cintura (cm)",
    helper: "Medida na linha do umbigo, em posição relaxada.",
    placeholder: "Ex.: 72",
  },
  {
    id: "hip",
    label: "Circunferência do quadril (cm)",
    helper: "Medida no ponto de maior volume.",
    placeholder: "Ex.: 98",
  },
  {
    id: "neck",
    label: "Circunferência do pescoço (cm)",
    helper: "Logo abaixo da laringe.",
    placeholder: "Ex.: 34",
  },
];

const maleFields: FieldConfig[] = [
  {
    id: "height",
    label: "Altura (cm)",
    helper: "Use sua altura total, descalço.",
    placeholder: "Ex.: 178",
  },
  {
    id: "abdomen",
    label: "Circunferência do abdômen na altura do umbigo (cm)",
    helper:
      "Para a fórmula da Marinha usamos esta medida como componente de cintura.",
    placeholder: "Ex.: 88",
  },
  {
    id: "neck",
    label: "Circunferência do pescoço (cm)",
    helper: "Logo abaixo da laringe.",
    placeholder: "Ex.: 38",
  },
];

const defaultMeasurements: Measurements = {
  height: "",
  waist: "",
  hip: "",
  neck: "",
  abdomen: "",
};

const classifyBodyFat = (sex: Sex, value: number): string => {
  if (sex === "female") {
    if (value < 18) return "Abaixo do ideal";
    if (value <= 30) return "Faixa considerada saudável";
    return "Acima do ideal";
  }

  if (value < 10) return "Abaixo do ideal";
  if (value <= 20) return "Faixa considerada saudável";
  return "Acima do ideal";
};

const loadCachedState = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      sex: Sex;
      measurements: Measurements;
      result?: Result | null;
    };
  } catch (error) {
    console.warn("Não foi possível ler o cache da calculadora", error);
    return null;
  }
};

const saveCachedState = (payload: {
  sex: Sex;
  measurements: Measurements;
  result?: Result | null;
}) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const validateMeasurements = (
  sex: Sex,
  measurements: Measurements,
  touched: Set<keyof Measurements>
) => {
  const errors: Partial<Record<keyof Measurements, string>> = {};

  const requiredFields: (keyof Measurements)[] =
    sex === "female" ? ["height", "waist", "hip", "neck"] : ["height", "abdomen", "neck"];

  const numberWithin = (
    value: string,
    field: keyof Measurements,
    min: number,
    max: number
  ) => {
    if (!value && requiredFields.includes(field) && touched.has(field)) {
      errors[field] = "Campo obrigatório";
      return;
    }

    if (!value) return;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      errors[field] = "Use apenas números";
      return;
    }
    if (parsed < min || parsed > max) {
      errors[field] = `Valor esperado entre ${min} e ${max}`;
    }
  };

  numberWithin(measurements.height, "height", 120, 230);
  if (sex === "female") {
    numberWithin(measurements.waist, "waist", 40, 200);
    numberWithin(measurements.hip, "hip", 40, 220);
  } else {
    numberWithin(measurements.abdomen, "abdomen", 40, 200);
  }
  numberWithin(measurements.neck, "neck", 25, 60);

  const toPositive = (value: string) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const height = toPositive(measurements.height);
  const neck = toPositive(measurements.neck);

  if (height !== null && height <= 0) {
    errors.height = "Altura deve ser maior que zero";
  }

  if (sex === "female") {
    const waist = toPositive(measurements.waist);
    const hip = toPositive(measurements.hip);
    if (waist !== null && hip !== null && neck !== null) {
      const term = waist + hip - neck;
      if (term <= 0) {
        errors.waist = "Revise as medidas de cintura/quadril";
      }
    }
  } else {
    const abdomen = toPositive(measurements.abdomen);
    if (abdomen !== null && neck !== null) {
      const term = abdomen + abdomen - neck;
      if (term <= 0) {
        errors.abdomen = "Revise as medidas do abdômen/pescoço";
      }
    }
  }

  return errors;
};

const GaugeBar: React.FC<{ value: number; sex: Sex }> = ({ value, sex }) => {
  const ranges =
    sex === "female"
      ? [
          { label: "Abaixo", color: "bg-primary-300", max: 18 },
          { label: "Saudável", color: "bg-primary-500", max: 30 },
          { label: "Acima", color: "bg-warning", max: 60 },
        ]
      : [
          { label: "Abaixo", color: "bg-primary-300", max: 10 },
          { label: "Saudável", color: "bg-primary-500", max: 20 },
          { label: "Acima", color: "bg-warning", max: 50 },
        ];

  const position = Math.min(value, ranges[ranges.length - 1].max);

  return (
    <div className="mt-4">
      <div className="flex gap-1 text-[11px] font-semibold text-neutral-600">
        {ranges.map((range) => (
          <div key={range.label} className="flex-1 text-center">
            {range.label}
          </div>
        ))}
      </div>
      <div className="relative mt-1 flex overflow-hidden rounded-full bg-white/70">
        {ranges.map((range, index) => {
          const prevMax = index === 0 ? 0 : ranges[index - 1].max;
          const width = range.max - prevMax;
          return <div key={range.label} className={`${range.color} h-2`} style={{ width: `${(width / ranges[ranges.length - 1].max) * 100}%` }} />;
        })}
        <div
          className="absolute -top-1 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-primary-900 shadow"
          style={{ left: `${(position / ranges[ranges.length - 1].max) * 100}%`, transform: "translate(-50%, -50%)" }}
          aria-hidden
        />
      </div>
    </div>
  );
};

const BodyFatCalculator: React.FC = () => {
  const cached = React.useMemo(() => loadCachedState(), []);
  const [sex, setSex] = React.useState<Sex>(cached?.sex ?? "female");
  const [measurements, setMeasurements] = React.useState<Measurements>(
    cached?.measurements ?? defaultMeasurements
  );
  const [touched, setTouched] = React.useState<Set<keyof Measurements>>(new Set());
  const [result, setResult] = React.useState<Result | null>(cached?.result ?? null);
  const [submitError, setSubmitError] = React.useState<string>("");
  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    saveCachedState({ sex, measurements, result });
  }, [measurements, result, sex]);

  const errors = React.useMemo(() => validateMeasurements(sex, measurements, touched), [sex, measurements, touched]);

  const handleFieldChange = (field: keyof Measurements, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => new Set(prev).add(field));
  };

  const clearData = () => {
    setMeasurements(defaultMeasurements);
    setResult(null);
    setTouched(new Set());
    setSubmitError("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const isFormValid = () => {
    const required = sex === "female" ? ["height", "waist", "hip", "neck"] : ["height", "abdomen", "neck"];
    return required.every((field) => {
      const value = measurements[field as keyof Measurements];
      return value !== "" && !(errors as Record<string, string>)[field as string];
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextTouched = new Set(touched);
    (sex === "female" ? femaleFields : maleFields).forEach((field) => nextTouched.add(field.id));
    setTouched(nextTouched);

    const currentErrors = validateMeasurements(sex, measurements, nextTouched);
    const hasErrors = Object.values(currentErrors).some(Boolean);
    if (hasErrors) {
      setSubmitError("Preencha os campos obrigatórios com valores realistas.");
      return;
    }

    const height = Number(measurements.height);
    const neck = Number(measurements.neck);
    const waist = sex === "female" ? Number(measurements.waist) : Number(measurements.abdomen);
    const hip = sex === "female" ? Number(measurements.hip) : Number(measurements.abdomen);

    const circumferenceTerm = waist + hip - neck;
    if (circumferenceTerm <= 0 || height <= 0) {
      setSubmitError("As combinações de medidas precisam ser maiores que zero. Revise as medidas.");
      return;
    }

    const bodyFat = 163.205 * Math.log10(circumferenceTerm) - 97.684 * Math.log10(height) - 78.387;
    const value = Number(bodyFat.toFixed(1));
    const classification = classifyBodyFat(sex, value);

    setResult({ value, classification });
    setSubmitError("");
  };

  const downloadInstagramPost = async () => {
    try {
      setIsDownloading(true);
      const width = 1080;
      const height = 1350;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas não suportado");

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(46,106,80,0.92)");
      gradient.addColorStop(1, "rgba(244,203,180,0.92)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(80, 140, width - 160, height - 280);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 64px 'Inter', 'Helvetica Neue', Arial";
      ctx.textAlign = "center";
      ctx.fillText("Calculadora de Gordura", width / 2, 260);

      ctx.font = "600 42px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Método Marinha Americana", width / 2, 330);

      ctx.font = "400 32px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Use medidas simples e descubra sua % em segundos", width / 2, 420);

      ctx.font = "400 30px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Acesse o site e calcule agora", width / 2, 500);

      ctx.font = "600 140px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillStyle = "#1F2622";
      ctx.fillText("%", width / 2, 680);

      ctx.font = "500 34px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Post pronto em 1080x1350", width / 2, 820);

      const glassGradient = ctx.createLinearGradient(0, 0, width, 0);
      glassGradient.addColorStop(0, "rgba(255,255,255,0.55)");
      glassGradient.addColorStop(1, "rgba(255,255,255,0.25)");
      ctx.fillStyle = glassGradient;
      const glassX = 180;
      const glassY = 900;
      const glassWidth = width - 360;
      const glassHeight = 200;
      const radius = 32;
      ctx.beginPath();
      ctx.moveTo(glassX + radius, glassY);
      ctx.lineTo(glassX + glassWidth - radius, glassY);
      ctx.quadraticCurveTo(glassX + glassWidth, glassY, glassX + glassWidth, glassY + radius);
      ctx.lineTo(glassX + glassWidth, glassY + glassHeight - radius);
      ctx.quadraticCurveTo(
        glassX + glassWidth,
        glassY + glassHeight,
        glassX + glassWidth - radius,
        glassY + glassHeight
      );
      ctx.lineTo(glassX + radius, glassY + glassHeight);
      ctx.quadraticCurveTo(glassX, glassY + glassHeight, glassX, glassY + glassHeight - radius);
      ctx.lineTo(glassX, glassY + radius);
      ctx.quadraticCurveTo(glassX, glassY, glassX + radius, glassY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#1F4D3A";
      ctx.font = "600 36px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Calculadora % Gordura", width / 2, 990);
      ctx.font = "400 30px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Pronta para compartilhar", width / 2, 1040);

      const link = document.createElement("a");
      link.download = "calculadora-gordura-marinha-instagram.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const visibleFields = sex === "female" ? femaleFields : maleFields;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700/60 via-peach-500/40 to-surface-200/60 py-14">
      <div className="absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="glass-card border-white/60 px-6 py-8 shadow-2xl md:px-10 md:py-12">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-900/80">Ferramenta rápida</p>
              <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">
                Calculadora de % de Gordura – Método Marinha Americana
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-neutral-700 md:text-base">
                Estimativa baseada em circunferências corporais. Use fita métrica flexível, mantenha postura confortável e
                lembre-se: este resultado não substitui avaliação presencial ou exames como DEXA.
              </p>
            </div>
            <button
              type="button"
              onClick={clearData}
              className="rounded-full border border-neutral-900/10 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-white/70"
            >
              Limpar dados
            </button>
          </div>

          <div className="mt-8">
            <div className="inline-flex rounded-full bg-white/70 p-1 shadow-inner">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sex === "female" ? "bg-primary-700 text-white shadow" : "text-neutral-800"
                }`}
                onClick={() => setSex("female")}
                aria-pressed={sex === "female"}
              >
                Feminino
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sex === "male" ? "bg-primary-700 text-white shadow" : "text-neutral-800"
                }`}
                onClick={() => setSex("male")}
                aria-pressed={sex === "male"}
              >
                Masculino
              </button>
            </div>
          </div>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              {visibleFields.map((field) => (
                <label key={field.id} className="flex flex-col gap-2 rounded-2xl bg-white/70 p-4 shadow">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-neutral-900">{field.label}</span>
                    <span className="rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-semibold text-white">cm</span>
                  </div>
                  <input
                    id={field.id}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={measurements[field.id]}
                    onChange={(event) => handleFieldChange(field.id, event.target.value)}
                    onBlur={() => setTouched((prev) => new Set(prev).add(field.id))}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-base font-semibold text-neutral-900 shadow-inner outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
                    aria-describedby={`${field.id}-helper ${field.id}-error`}
                  />
                  {field.helper && (
                    <p id={`${field.id}-helper`} className="text-xs text-neutral-600">
                      {field.helper}
                    </p>
                  )}
                  {errors[field.id] && (
                    <p id={`${field.id}-error`} className="text-xs font-semibold text-error">
                      {errors[field.id]}
                    </p>
                  )}
                </label>
              ))}
            </div>

            {submitError && <p className="mt-4 text-sm font-semibold text-error">{submitError}</p>}

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`button-primary flex-1 justify-center gap-2 text-base font-semibold md:flex-none md:px-8 ${
                  !isFormValid() ? "opacity-70" : ""
                }`}
              >
                Calcular agora
              </button>
              <button
                type="button"
                onClick={downloadInstagramPost}
                className="flex items-center justify-center gap-2 rounded-full border border-neutral-900/10 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:bg-white/70"
                disabled={isDownloading}
              >
                {isDownloading ? "Gerando post..." : "Baixar post para Instagram"}
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-8 rounded-2xl bg-white/80 p-6 shadow-inner">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">Resultado</p>
              <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-4xl font-bold text-neutral-900">{result.value}%</p>
                  <p className="text-base font-semibold text-primary-700">{result.classification}</p>
                </div>
                <div className="md:max-w-[320px]">
                  <GaugeBar value={result.value} sex={sex} />
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-700">
                Este valor é uma estimativa baseada no método da Marinha Americana e no log10 das circunferências inseridas. Para
                avaliação detalhada, exames específicos ou orientação personalizada, consulte um profissional de saúde.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BodyFatCalculator;

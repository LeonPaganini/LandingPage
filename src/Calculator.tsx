import React from "react";
import { salvarLeadCalculadora } from "./leadService.js";

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

type LeadInfo = {
  fullName: string;
  phone: string;
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

const defaultLeadInfo: LeadInfo = {
  fullName: "",
  phone: "",
};

const cmToInches = (value: number) => value / 2.54;

const normalizePhoneNumber = (value: string) => value.replace(/\D/g, "").slice(0, 11);

const formatPhoneNumber = (digits: string) => {
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const calculateBodyFat = (
  sex: Sex,
  {
    height,
    waist,
    hip,
    neck,
    abdomen,
  }: { height: number; waist?: number; hip?: number; neck: number; abdomen?: number }
) => {
  const heightIn = cmToInches(height);
  const neckIn = cmToInches(neck);

  if (Number.isNaN(height) || Number.isNaN(neck)) return null;

  if (heightIn <= 0) return null;

  if (sex === "female") {
    if (waist === undefined || hip === undefined) return null;
    if (Number.isNaN(waist) || Number.isNaN(hip)) return null;
    const circumferenceTerm = cmToInches(waist) + cmToInches(hip) - neckIn;
    if (circumferenceTerm <= 0) return null;

    return 163.205 * Math.log10(circumferenceTerm) - 97.684 * Math.log10(heightIn) - 78.387;
  }

  if (abdomen === undefined) return null;
  if (Number.isNaN(abdomen)) return null;
  const circumferenceTerm = cmToInches(abdomen) + cmToInches(abdomen) - neckIn;
  if (circumferenceTerm <= 0) return null;

  return 163.205 * Math.log10(circumferenceTerm) - 97.684 * Math.log10(heightIn) - 78.387;
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

const selectPersonalizedPhrase = (classification: string) => {
  const normalized = classification.toLowerCase();

  if (normalized.includes("excelente")) {
    return "Excelente resultado! Mantenha sua rotina e inspire outras pessoas.";
  }

  if (normalized.includes("saud")) {
    return "Na média ideal! Continue evoluindo!";
  }

  if (normalized.includes("acima")) {
    return "Agora sei exatamente onde melhorar — e você pode descobrir o seu também.";
  }

  if (normalized.includes("abaixo")) {
    return "Volume baixo! Mas saúde é equilíbrio. Confira o seu também.";
  }

  return "Na média ideal! Continue evoluindo!";
};

const loadCachedState = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      sex: Sex;
      measurements: Measurements;
      leadInfo?: LeadInfo;
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
  leadInfo: LeadInfo;
  result?: Result | null;
}) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const validateLeadInfo = (leadInfo: LeadInfo, touched: Set<keyof LeadInfo>) => {
  const errors: Partial<Record<keyof LeadInfo, string>> = {};

  const trimmedName = leadInfo.fullName.trim();
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/u;

  if (touched.has("fullName")) {
    if (!trimmedName) {
      errors.fullName = "Informe um nome válido (mínimo 3 caracteres).";
    } else if (trimmedName.length < 3) {
      errors.fullName = "Informe um nome válido (mínimo 3 caracteres).";
    } else if (trimmedName.length > 80) {
      errors.fullName = "Nome deve ter no máximo 80 caracteres.";
    } else if (!nameRegex.test(leadInfo.fullName)) {
      errors.fullName = "Use apenas letras e espaços.";
    }
  }

  if (touched.has("phone")) {
    const digits = normalizePhoneNumber(leadInfo.phone);
    if (!digits || digits.length !== 11) {
      errors.phone = "Informe um celular válido com DDD (11 dígitos).";
    }
  }

  return errors;
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
  const [leadInfo, setLeadInfo] = React.useState<LeadInfo>(cached?.leadInfo ?? defaultLeadInfo);
  const [touched, setTouched] = React.useState<Set<keyof Measurements>>(new Set());
  const [leadTouched, setLeadTouched] = React.useState<Set<keyof LeadInfo>>(new Set());
  const [result, setResult] = React.useState<Result | null>(cached?.result ?? null);
  const [submitError, setSubmitError] = React.useState<string>("");
  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    saveCachedState({ sex, measurements, leadInfo, result });
  }, [leadInfo, measurements, result, sex]);

  const measurementErrors = React.useMemo(
    () => validateMeasurements(sex, measurements, touched),
    [sex, measurements, touched]
  );
  const leadErrors = React.useMemo(() => validateLeadInfo(leadInfo, leadTouched), [leadInfo, leadTouched]);

  const handleFieldChange = (field: keyof Measurements, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => new Set(prev).add(field));
  };

  const handleLeadChange = (field: keyof LeadInfo, value: string) => {
    if (field === "phone") {
      const digits = normalizePhoneNumber(value);
      setLeadInfo((prev) => ({ ...prev, phone: digits }));
      setLeadTouched((prev) => new Set(prev).add(field));
      return;
    }

    setLeadInfo((prev) => ({ ...prev, fullName: value }));
    setLeadTouched((prev) => new Set(prev).add(field));
  };

  const clearData = () => {
    setMeasurements(defaultMeasurements);
    setLeadInfo(defaultLeadInfo);
    setResult(null);
    setTouched(new Set());
    setLeadTouched(new Set());
    setSubmitError("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const isFormValid = () => {
    const required = sex === "female" ? ["height", "waist", "hip", "neck"] : ["height", "abdomen", "neck"];
    const measurementsAreValid = required.every((field) => {
      const value = measurements[field as keyof Measurements];
      return value !== "" && !(measurementErrors as Record<string, string>)[field as string];
    });

    const trimmedName = leadInfo.fullName.trim();
    const nameValid =
      trimmedName.length >= 3 &&
      trimmedName.length <= 80 &&
      !leadErrors.fullName;
    const phoneValid = leadInfo.phone.length === 11 && !leadErrors.phone;

    return measurementsAreValid && nameValid && phoneValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextTouched = new Set(touched);
    (sex === "female" ? femaleFields : maleFields).forEach((field) => nextTouched.add(field.id));
    setTouched(nextTouched);

    const nextLeadTouched = new Set<keyof LeadInfo>(leadTouched);
    (["fullName", "phone"] as (keyof LeadInfo)[]).forEach((field) => nextLeadTouched.add(field));
    setLeadTouched(nextLeadTouched);

    const currentErrors = validateMeasurements(sex, measurements, nextTouched);
    const currentLeadErrors = validateLeadInfo(leadInfo, nextLeadTouched);
    const hasErrors =
      Object.values(currentErrors).some(Boolean) || Object.values(currentLeadErrors).some(Boolean);
    if (hasErrors) {
      setSubmitError("Preencha os campos obrigatórios com valores realistas.");
      return;
    }

    const trimmedName = leadInfo.fullName.trim();
    const height = Number(measurements.height);
    const neck = Number(measurements.neck);
    const waist = sex === "female" ? Number(measurements.waist) : undefined;
    const hip = sex === "female" ? Number(measurements.hip) : undefined;
    const abdomen = sex === "male" ? Number(measurements.abdomen) : undefined;

    const bodyFat = calculateBodyFat(sex, { height, waist, hip, neck, abdomen });
    if (bodyFat === null) {
      setSubmitError("As combinações de medidas precisam ser maiores que zero. Revise as medidas.");
      return;
    }
    const value = Number(bodyFat.toFixed(1));
    const classification = classifyBodyFat(sex, value);

    setResult({ value, classification });
    setSubmitError("");

    void salvarLeadCalculadora({
      nome: trimmedName,
      celular: leadInfo.phone,
      genero: sex === "female" ? "feminino" : "masculino",
      resultado_gordura: value,
      dados_medidas: {
        altura_cm: height,
        pescoco_cm: neck,
        cintura_cm: sex === "female" ? waist : undefined,
        quadril_cm: sex === "female" ? hip : undefined,
        abdomen_cm: sex === "male" ? abdomen : undefined,
      },
    });
  };

  const downloadInstagramPost = async () => {
    if (!result) {
      setSubmitError("Calcule seu percentual antes de gerar a arte compartilhável.");
      return;
    }

    try {
      setIsDownloading(true);
      const width = 1080;
      const height = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas não suportado");

      const drawRoundedRect = (
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        rectWidth: number,
        rectHeight: number,
        radius: number
      ) => {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + rectWidth - radius, y);
        context.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + radius);
        context.lineTo(x + rectWidth, y + rectHeight - radius);
        context.quadraticCurveTo(x + rectWidth, y + rectHeight, x + rectWidth - radius, y + rectHeight);
        context.lineTo(x + radius, y + rectHeight);
        context.quadraticCurveTo(x, y + rectHeight, x, y + rectHeight - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        context.fill();
      };

      const drawWrappedText = (
        context: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
      ) => {
        const words = text.split(" ");
        let line = "";
        let currentY = y;

        for (let n = 0; n < words.length; n += 1) {
          const testLine = `${line}${words[n]} `;
          const metrics = context.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            context.fillText(line.trim(), x, currentY);
            line = `${words[n]} `;
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line.trim(), x, currentY);
        return currentY + lineHeight;
      };

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0f3a2c");
      gradient.addColorStop(0.5, "#1e5c47");
      gradient.addColorStop(1, "#efe5d4");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const cardWidth = width * 0.86;
      const cardHeight = height - 240;
      const cardX = (width - cardWidth) / 2;
      const cardY = 120;
      const cardRadius = 40;

      ctx.save();
      ctx.filter = "blur(14px)";
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
      ctx.restore();

      ctx.save();
      ctx.shadowColor = "rgba(15,23,42,0.14)";
      ctx.shadowBlur = 26;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = "rgba(255,255,255,0.26)";
      drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
      ctx.restore();

      const innerPadding = 96;
      const contentMaxWidth = cardWidth - innerPadding * 2;
      const centerX = width / 2;
      let currentY = cardY + 120;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = "#0F172A";
      ctx.font = "800 56px 'Poppins', 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Meu Resultado – % de Gordura Corporal", centerX, currentY);

      currentY += 66;
      ctx.fillStyle = "#1f2937";
      ctx.font = "600 34px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Método Marinha Americana", centerX, currentY);

      currentY += 86;
      ctx.fillStyle = "#111827";
      ctx.font = "700 38px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Meu percentual de gordura:", centerX, currentY);

      currentY += 130;
      ctx.fillStyle = "#0b1f17";
      ctx.font = "800 150px 'Poppins', 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText(`${result.value.toFixed(1)}%`, centerX, currentY);

      currentY += 120;
      ctx.fillStyle = "#0f2f22";
      ctx.font = "700 40px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText(`Faixa: ${result.classification}`, centerX, currentY);

      currentY += 80;
      ctx.fillStyle = "#111827";
      ctx.font = "500 34px 'Inter', 'Helvetica Neue', Arial";

      const drawPersonalizedText = drawWrappedText(
        ctx,
        selectPersonalizedPhrase(result.classification),
        centerX,
        currentY,
        contentMaxWidth,
        48
      );

      currentY = drawPersonalizedText + 48;
      ctx.fillStyle = "#0b1f17";
      ctx.font = "700 42px 'Inter', 'Helvetica Neue', Arial";
      const drawViral = drawWrappedText(
        ctx,
        "Compartilhe o seu também e me marque!",
        centerX,
        currentY,
        contentMaxWidth - 80,
        50
      );

      currentY = drawViral + 90;
      const ctaWidth = cardWidth - 200;
      const ctaHeight = 170;
      const ctaX = centerX - ctaWidth / 2;
      const ctaY = currentY - ctaHeight / 2;

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = "#0f3d2f";
      drawRoundedRect(ctx, ctaX, ctaY, ctaWidth, ctaHeight, 38);
      ctx.restore();

      ctx.fillStyle = "#f9fafb";
      ctx.font = "800 44px 'Poppins', 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Calcule Gratuitamente", centerX, ctaY + 68);

      ctx.fillStyle = "rgba(249,250,251,0.86)";
      ctx.font = "500 30px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText("Descubra o seu resultado em 10 segundos.", centerX, ctaY + 116);

      ctx.fillStyle = "#1f2937";
      ctx.font = "500 26px 'Inter', 'Helvetica Neue', Arial";
      ctx.fillText(
        "Calculadora de Gordura – Desenvolvida por Nutri Thaís Paganini",
        centerX,
        cardY + cardHeight - 80
      );

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
                  sex === "female"
                    ? "bg-rose-400 text-white shadow hover:bg-rose-500"
                    : "text-neutral-800 hover:bg-white/70"
                }`}
                onClick={() => setSex("female")}
                aria-pressed={sex === "female"}
              >
                Feminino
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sex === "male"
                    ? "bg-primary-700 text-white shadow hover:bg-primary-900"
                    : "text-neutral-800 hover:bg-white/70"
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
              <label className="flex flex-col gap-2 rounded-2xl bg-white/70 p-4 shadow">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-neutral-900">Nome completo</span>
                  <span className="rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-semibold text-white">Lead</span>
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={leadInfo.fullName}
                  maxLength={80}
                  onChange={(event) => handleLeadChange("fullName", event.target.value)}
                  onBlur={() => setLeadTouched((prev) => new Set(prev).add("fullName"))}
                  placeholder="Ex.: Ana Silva"
                  className="w-full rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-base font-semibold text-neutral-900 shadow-inner outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
                  aria-describedby="fullName-error"
                  autoComplete="name"
                />
                {leadErrors.fullName && (
                  <p id="fullName-error" className="text-xs font-semibold text-error">
                    {leadErrors.fullName}
                  </p>
                )}
              </label>

              <label className="flex flex-col gap-2 rounded-2xl bg-white/70 p-4 shadow">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-neutral-900">Celular (WhatsApp)</span>
                  <span className="rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-semibold text-white">Contato</span>
                </div>
              
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={formatPhoneNumber(leadInfo.phone)}
                  onChange={(event) => handleLeadChange("phone", event.target.value)}
                  onBlur={() => setLeadTouched((prev) => new Set(prev).add("phone"))}
                  placeholder="(11) 98765-4321"
                  className="w-full rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-base font-semibold text-neutral-900 shadow-inner outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
                  aria-describedby="phone-error"
                  autoComplete="tel-national"
                />
              
                {leadErrors.phone && (
                  <p id="phone-error" className="text-xs font-semibold text-error">
                    {leadErrors.phone}
                  </p>
                )}
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                  {measurementErrors[field.id] && (
                    <p id={`${field.id}-error`} className="text-xs font-semibold text-error">
                      {measurementErrors[field.id]}
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

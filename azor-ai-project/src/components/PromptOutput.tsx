import { useState } from "react";
import { cn } from "../utils/cn";
import type { GeneratedPrompt, InferenceConfig } from "../promptEngine";
import {
  Copy,
  Check,
  Cpu,
  Thermometer,
  BarChart3,
  Server,
  FileText,
  ArrowLeft,
  Download,
  Sparkles,
  Globe,
  Target,
  UserCheck,
  Hash,
} from "lucide-react";

interface PromptOutputProps {
  prompt: GeneratedPrompt;
  inferenceConfig: InferenceConfig;
  onBack: () => void;
}

export function PromptOutput({ prompt, inferenceConfig, onBack }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([prompt.fullPromptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prompt.projectName.replace(/\s+/g, "-").toLowerCase()}-prompt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-slide-up space-y-6">
      {/* Cabeçalho com Nome do Projeto */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Editar Configuração
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Baixar .txt
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all",
              copied
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/20"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Título do Projeto */}
      <div className="bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-pink-600/10 border border-violet-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{prompt.projectName}</h2>
            <p className="text-xs text-slate-400">
              Prompt otimizado para ChatGPT • {prompt.charCount.toLocaleString("pt-BR")} caracteres
            </p>
          </div>
        </div>
      </div>

      {/* Detecções Automáticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-slate-400 font-medium">Domínio Detectado</span>
          </div>
          <span className="text-sm font-semibold text-blue-300">{prompt.detectedDomain}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">Tipo de Tarefa</span>
          </div>
          <span className="text-sm font-semibold text-emerald-300">{prompt.detectedTaskType}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="text-xs text-slate-400 font-medium">Persona Selecionada</span>
          </div>
          <span className="text-sm font-semibold text-fuchsia-300">{prompt.detectedPersona}</span>
        </div>
      </div>

      {/* Prompt Completo */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Prompt Gerado — Pronto para o ChatGPT
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500 font-mono">
              {prompt.charCount.toLocaleString("pt-BR")} / 3.000
            </span>
          </div>
        </div>

        {/* Barra de progresso de caracteres */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              prompt.charCount > 2700
                ? "bg-gradient-to-r from-amber-500 to-rose-500"
                : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
            )}
            style={{ width: `${Math.min((prompt.charCount / 3000) * 100, 100)}%` }}
          />
        </div>

        <div className="mt-3 bg-slate-900/80 border border-slate-700/50 rounded-xl p-5 overflow-auto max-h-[500px] custom-scrollbar">
          <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
            {prompt.fullPromptText}
          </pre>
        </div>
      </div>

      {/* Como usar */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
        <p className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider">
          🚀 Como usar este prompt
        </p>
        <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
          <li>Clique em <span className="text-emerald-300 font-medium">"Copiar Prompt"</span> acima</li>
          <li>Abra o <span className="text-emerald-300 font-medium">ChatGPT</span> (chat.openai.com)</li>
          <li>Cole o prompt no campo de mensagem e envie</li>
          <li>O ChatGPT responderá seguindo todas as instruções e restrições do prompt</li>
        </ol>
      </div>

      {/* Configuração de Inferência */}
      <div className="border border-slate-700/50 rounded-xl p-5 bg-slate-900/50">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-fuchsia-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Configuração Recomendada de Inferência
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400 font-medium">Temperatura</span>
            </div>
            <span className="text-lg font-bold text-white">{inferenceConfig.temperature}</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-slate-400 font-medium">Top-p</span>
            </div>
            <span className="text-lg font-bold text-white">{inferenceConfig.topP}</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-slate-400 font-medium">Modelo</span>
            </div>
            <span className="text-sm font-bold text-white">{inferenceConfig.recommendedModel}</span>
          </div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/20">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Justificativa Técnica
          </span>
          <p className="text-sm text-slate-300 leading-relaxed">
            {inferenceConfig.justification}
          </p>
        </div>
      </div>
    </div>
  );
}

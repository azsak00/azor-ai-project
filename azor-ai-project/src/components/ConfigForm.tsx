import { cn } from "../utils/cn";
import type { PromptConfig } from "../promptEngine";
import {
  FolderOpen,
  MessageSquareText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ConfigFormProps {
  config: PromptConfig;
  onChange: (config: PromptConfig) => void;
  onGenerate: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function ConfigForm({
  config,
  onChange,
  onGenerate,
  currentStep,
  onStepChange,
}: ConfigFormProps) {
  const update = (key: keyof PromptConfig, value: string) => {
    onChange({ ...config, [key]: value });
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 0:
        return config.projectName.trim().length >= 3;
      case 1:
        return config.projectContext.trim().length >= 20;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Passo 1: Nome do Projeto */}
      {currentStep === 0 && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Passo 1 — Nome do Projeto
              </h2>
              <p className="text-sm text-slate-400">
                Dê um nome para identificar seu projeto de prompt
              </p>
            </div>
          </div>
          <input
            type="text"
            value={config.projectName}
            onChange={(e) => update("projectName", e.target.value)}
            placeholder="Ex.: Assistente de Atendimento ao Cliente, Gerador de Relatórios, Análise de Mercado..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-sm"
            maxLength={80}
          />
          <div className="flex justify-between items-center mt-2">
            <span
              className={cn(
                "text-xs",
                config.projectName.trim().length >= 3
                  ? "text-slate-500"
                  : "text-amber-500"
              )}
            >
              {config.projectName.trim().length >= 3
                ? `${config.projectName.length}/80 caracteres`
                : "Mínimo de 3 caracteres"}
            </span>
          </div>
        </div>
      )}

      {/* Passo 2: Contexto do Projeto */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <MessageSquareText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Passo 2 — Contexto do Projeto
              </h2>
              <p className="text-sm text-slate-400">
                Descreva detalhadamente o que você deseja que o prompt faça
              </p>
            </div>
          </div>

          <textarea
            value={config.projectContext}
            onChange={(e) => update("projectContext", e.target.value)}
            placeholder={`Descreva com detalhes o que você precisa. Quanto mais informação, melhor será o prompt gerado.\n\nExemplos:\n• "Quero um prompt para analisar feedbacks de clientes e gerar um relatório com os principais problemas e soluções"\n• "Preciso de um prompt que crie planos de aula personalizados para alunos do ensino médio"\n• "Quero um prompt para gerar código Python que faça análise de dados de vendas"`}
            className="w-full h-52 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none text-sm leading-relaxed"
          />

          <div className="flex justify-between items-center mt-2">
            <span
              className={cn(
                "text-xs",
                config.projectContext.trim().length >= 20
                  ? "text-slate-500"
                  : "text-amber-500"
              )}
            >
              {config.projectContext.trim().length >= 20
                ? `${config.projectContext.length} caracteres`
                : `Mínimo de 20 caracteres (faltam ${20 - config.projectContext.trim().length})`}
            </span>
            <span className="text-xs text-slate-600">
              O prompt gerado terá no máximo 3.000 caracteres
            </span>
          </div>

          {/* Dicas rápidas */}
          <div className="mt-4 bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              💡 Dicas para um bom contexto:
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li>• Descreva o <span className="text-slate-300">objetivo principal</span> com clareza</li>
              <li>• Mencione o <span className="text-slate-300">público-alvo</span>, se houver</li>
              <li>• Indique o <span className="text-slate-300">formato de saída</span> desejado (relatório, JSON, lista, etc.)</li>
              <li>• Inclua <span className="text-slate-300">restrições ou regras</span> específicas</li>
              <li>• Forneça <span className="text-slate-300">exemplos</span> do resultado esperado</li>
            </ul>
          </div>
        </div>
      )}

      {/* Navegação */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => onStepChange(currentStep - 1)}
          className={cn(
            "px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
            currentStep === 0
              ? "invisible"
              : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50"
          )}
        >
          Voltar
        </button>

        {currentStep < 1 ? (
          <button
            onClick={() => onStepChange(currentStep + 1)}
            disabled={!canProceed(currentStep)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
              canProceed(currentStep)
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            )}
          >
            Próximo
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onGenerate}
            disabled={!canProceed(currentStep)}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              canProceed(currentStep)
                ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105 animate-pulse-glow"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Gerar Prompt Otimizado
          </button>
        )}
      </div>
    </div>
  );
}

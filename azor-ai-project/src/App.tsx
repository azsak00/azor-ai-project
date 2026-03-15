import { useState } from "react";
import { StepIndicator } from "./components/StepIndicator";
import { ConfigForm } from "./components/ConfigForm";
import { PromptOutput } from "./components/PromptOutput";
import {
  generatePrompt,
  getInferenceConfig,
  type PromptConfig,
  type GeneratedPrompt,
  type InferenceConfig,
} from "./promptEngine";
import { Github } from "lucide-react";

const STEPS = ["Nome do Projeto", "Contexto do Projeto"];

const defaultConfig: PromptConfig = {
  projectName: "",
  projectContext: "",
};

export default function App() {
  const [config, setConfig] = useState<PromptConfig>(defaultConfig);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] =
    useState<GeneratedPrompt | null>(null);
  const [inferenceConfig, setInferenceConfig] =
    useState<InferenceConfig | null>(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleGenerate = () => {
    const prompt = generatePrompt(config);
    const inference = getInferenceConfig(config);
    setGeneratedPrompt(prompt);
    setInferenceConfig(inference);
    setShowOutput(true);
  };

  const handleBack = () => {
    setShowOutput(false);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setCurrentStep(0);
    setShowOutput(false);
    setGeneratedPrompt(null);
    setInferenceConfig(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white relative overflow-hidden">
      {/* Efeitos de Fundo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Padrão de Grade */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Cabeçalho */}
        <header className="text-center mb-10">
          <div className="flex flex-col items-center justify-center mb-4">
            {/* Logo do Projeto */}
            <div className="relative mb-4">
              <img
                src="https://i.imgur.com/mrHfAjB.png"
                alt="AZOR.AI Logo"
                width={100}
                height={120}
                className="object-contain drop-shadow-[0_0_25px_rgba(250,204,21,0.5)]"
                style={{ imageRendering: 'auto' }}
              />
            </div>

            {/* Título AZOR.AI */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-widest text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)] mb-2">
              AZOR.AI
            </h1>

            {/* Subtítulo */}
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Laboratório de Prompts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide mt-1">
              Transforme ideias em prompts otimizados para IA
            </p>
          </div>
          {!showOutput && (
            <p className="text-sm text-slate-400 max-w-lg mx-auto mt-3">
              Configure seu prompt, utilizando parâmetros otimizados (criados pelo
              projeto <span className="text-yellow-400 font-semibold">AZOR.IA</span>),
              para produzir a maior qualidade de saída dos LLMs avançados.
            </p>
          )}
        </header>

        {/* Conteúdo Principal */}
        {!showOutput ? (
          <div>
            <StepIndicator steps={STEPS} currentStep={currentStep} />
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-violet-900/10">
              <ConfigForm
                config={config}
                onChange={setConfig}
                onGenerate={handleGenerate}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
              />
            </div>

            {/* Pré-visualização Rápida */}
            {config.projectName && (
              <div className="mt-6 bg-slate-900/30 border border-slate-800/30 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">
                  Resumo da Configuração
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
                    📁 {config.projectName}
                  </span>
                  {config.projectContext && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
                      📝 {config.projectContext.substring(0, 50)}
                      {config.projectContext.length > 50 ? "..." : ""}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          generatedPrompt &&
          inferenceConfig && (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-violet-900/10">
              <PromptOutput
                prompt={generatedPrompt}
                inferenceConfig={inferenceConfig}
                onBack={handleBack}
              />
            </div>
          )
        )}

        {/* Rodapé */}
        <footer className="mt-12 text-center">
          {showOutput && (
            <button
              onClick={handleReset}
              className="mb-6 px-6 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-yellow-500/50 transition-all text-sm font-medium"
            >
              Criar Novo Prompt
            </button>
          )}
          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs">
            <span className="text-yellow-500/70 font-bold tracking-wider">AZOR.AI</span>
            <span className="text-slate-700">•</span>
            <span>Laboratório de Engenharia de Prompts</span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3" />
              Código Aberto
            </span>
          </div>
          <p className="text-xs text-white mt-2">
            criado por Paulo Henrique De Pin Ramos
          </p>
        </footer>
      </div>
    </div>
  );
}

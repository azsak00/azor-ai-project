import { cn } from "../utils/cn";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border-2",
                index < currentStep
                  ? "bg-violet-600/20 border-violet-600 text-violet-300"
                  : index === currentStep
                  ? "bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border-violet-500 text-white shadow-lg shadow-violet-500/20"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-500"
              )}
            >
              {step}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-8 md:w-16 h-0.5 mx-2 transition-all duration-300",
                index < currentStep ? "bg-violet-600" : "bg-slate-700"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

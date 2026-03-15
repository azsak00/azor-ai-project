export interface PromptConfig {
  projectName: string;
  projectContext: string;
}

export interface GeneratedPrompt {
  projectName: string;
  fullPromptText: string;
  charCount: number;
  detectedDomain: string;
  detectedTaskType: string;
  detectedPersona: string;
}

export interface InferenceConfig {
  temperature: string;
  topP: string;
  recommendedModel: string;
  justification: string;
}

// ========== AUTO-DETECTION ENGINE ==========

function detectDomain(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(código|programa|software|api|banco de dados|app|web|mobile|algoritmo|code|program|database|frontend|backend|devops|deploy)/.test(lower))
    return "Engenharia de Software e Tecnologia";
  if (/\b(dados|analytics|estatístic|métric|dashboard|visualização|data|statistics|metrics|bi|kpi)/.test(lower))
    return "Análise de Dados e Inteligência de Negócios";
  if (/\b(mercado|negócio|estratégia|receita|crescimento|competitiv|marca|marketing|vendas|market|business|strategy|revenue|growth|brand|sales)/.test(lower))
    return "Estratégia de Negócios e Marketing";
  if (/\b(pesquisa|estudo|hipótese|experimento|acadêmic|artigo|tese|científic|research|study|hypothesis|academic|paper|thesis)/.test(lower))
    return "Pesquisa Acadêmica e Ciência";
  if (/\b(conteúdo|escrever|blog|texto|narrativa|história|redação|content|write|copy|story|copywriting)/.test(lower))
    return "Criação de Conteúdo e Redação";
  if (/\b(jurídic|lei|regulament|conformidade|contrato|política|legal|law|regulation|compliance|contract|policy)/.test(lower))
    return "Jurídico e Conformidade";
  if (/\b(educação|ensinar|aprender|currículo|curso|treinamento|aula|aluno|professor|education|teach|learn|curriculum|course|training)/.test(lower))
    return "Educação e Design de Aprendizagem";
  if (/\b(design|ux|ui|interface|experiência do usuário|protótipo|wireframe|figma|user experience)/.test(lower))
    return "Design e Experiência do Usuário";
  if (/\b(saúde|médic|clínic|paciente|diagnóstico|tratamento|health|medical|clinical|patient|diagnosis)/.test(lower))
    return "Saúde e Medicina";
  if (/\b(finanç|investimento|portfólio|risco|bancário|orçamento|finance|investment|portfolio|risk|banking|budget)/.test(lower))
    return "Finanças e Investimentos";
  return "Geral / Multidisciplinar";
}

function detectTaskType(text: string): { type: string; label: string } {
  const lower = text.toLowerCase();
  if (/\b(criar|crie|gerar|gere|escrever|escreva|desenvolver|produza|produzir|elaborar|elabore|redija|redigir|monte|montar|construir|construa|inventar|compor|formular)/.test(lower))
    return { type: "creation", label: "Criação" };
  if (/\b(analis|examinar|examine|avaliar|avalie|investigar|investigue|diagnosticar|interpretar|interprete|comparar|compare|verificar|verifique|auditar)/.test(lower))
    return { type: "analysis", label: "Análise" };
  if (/\b(sintetizar|resumir|resuma|compilar|compile|consolidar|integrar|combinar|unificar|agregar)/.test(lower))
    return { type: "synthesis", label: "Síntese" };
  if (/\b(código|programar|codificar|implementar|desenvolver.*sistema|script|função|classe|api|endpoint|algoritmo|code|program)/.test(lower))
    return { type: "code-generation", label: "Geração de Código" };
  if (/\b(estratégia|planejar|planeje|roteiro|roadmap|plano|objetivos|metas|framework|modelo de negócio)/.test(lower))
    return { type: "strategic-planning", label: "Planejamento Estratégico" };
  if (/\b(documento|ler|leia|extrair|extraia|interpretar.*doc|analisar.*texto|revisar|revisão|fichamento)/.test(lower))
    return { type: "document-interpretation", label: "Interpretação de Documentos" };
  return { type: "creation", label: "Criação" };
}

function detectPersona(text: string, taskType: string): { persona: string; description: string } {
  const lower = text.toLowerCase();

  if (/\b(código|programa|software|api|sistema|app|web|frontend|backend|devops|script|deploy)/.test(lower))
    return { persona: "Engenheiro de Software Sênior", description: "especialista em arquitetura de software, boas práticas de desenvolvimento e soluções escaláveis" };
  if (/\b(dados|analytics|métric|dashboard|bi|kpi|estatístic)/.test(lower))
    return { persona: "Analista de Dados Especialista", description: "proficiente em análise estatística, visualização de dados e extração de insights acionáveis" };
  if (/\b(pesquisa|acadêmic|científic|hipótese|tese|artigo|estudo)/.test(lower))
    return { persona: "Pesquisador Acadêmico", description: "especialista em metodologias de pesquisa, revisão de literatura e análise rigorosa" };
  if (/\b(mercado|marketing|vendas|marca|growth|negócio|estratégia|competitiv)/.test(lower))
    return { persona: "Estrategista de Negócios", description: "experiente em análise de mercado, planejamento estratégico e inteligência competitiva" };
  if (/\b(conteúdo|escrever|blog|texto|redação|copywriting|narrativa)/.test(lower))
    return { persona: "Redator Profissional", description: "especialista em criação de conteúdo, storytelling e comunicação persuasiva" };
  if (/\b(jurídic|lei|contrato|regulament|conformidade|legal)/.test(lower))
    return { persona: "Especialista Jurídico", description: "profundo conhecedor de marcos regulatórios, análise contratual e conformidade legal" };
  if (/\b(educação|ensinar|aula|aluno|curso|treinamento|professor|currículo)/.test(lower))
    return { persona: "Educador Especialista", description: "domina estratégias pedagógicas, design instrucional e aprendizagem adaptativa" };
  if (/\b(design|ux|ui|interface|protótipo|wireframe|usabilidade)/.test(lower))
    return { persona: "Designer UX/UI Sênior", description: "especialista em experiência do usuário, design de interação e acessibilidade" };
  if (/\b(saúde|médic|clínic|paciente|tratamento|diagnóstico)/.test(lower))
    return { persona: "Especialista em Saúde", description: "conhecedor de protocolos clínicos, análise diagnóstica e boas práticas médicas" };
  if (/\b(finanç|investimento|orçamento|risco|portfólio|bancário)/.test(lower))
    return { persona: "Analista Financeiro", description: "experiente em análise financeira, gestão de riscos e planejamento orçamentário" };

  // Fallback baseado no tipo de tarefa
  const taskPersonaMap: Record<string, { persona: string; description: string }> = {
    "creation": { persona: "Especialista em Criação", description: "capaz de produzir conteúdo original, estruturado e de alta qualidade" },
    "analysis": { persona: "Analista Especialista", description: "proficiente em exame sistemático, avaliação crítica e geração de insights" },
    "synthesis": { persona: "Especialista em Síntese", description: "hábil em integrar múltiplas fontes em narrativas coerentes e abrangentes" },
    "code-generation": { persona: "Engenheiro de Software Sênior", description: "especialista em código limpo, eficiente e bem documentado" },
    "strategic-planning": { persona: "Estrategista Sênior", description: "experiente em planejamento estratégico, definição de metas e roadmaps" },
    "document-interpretation": { persona: "Analista de Documentos", description: "especialista em interpretação, extração e síntese de informações de documentos" },
  };

  return taskPersonaMap[taskType] || { persona: "Especialista Multidisciplinar", description: "capaz de análise rigorosa, pensamento estruturado e entrega de resultados precisos" };
}

function detectOutputFormat(text: string): string {
  const lower = text.toLowerCase();
  if (/\bjson\b/.test(lower)) return "JSON estruturado";
  if (/\b(relatório|report)\b/.test(lower)) return "relatório estruturado com seções";
  if (/\b(tabela|planilha|table)\b/.test(lower)) return "formato tabular";
  if (/\b(lista|tópicos|bullet)\b/.test(lower)) return "lista hierárquica organizada";
  if (/\b(plano|roadmap|cronograma)\b/.test(lower)) return "plano estratégico com cronograma";
  return "o formato mais adequado para a tarefa, com seções claras e organizadas";
}

// ========== INSTRUCTION GENERATION (per task type) ==========

function generateInstructions(taskType: string): string {
  const instructionMap: Record<string, string[]> = {
    "creation": [
      "Interprete o objetivo central da solicitação",
      "Identifique o público-alvo, tom e estilo adequados",
      "Desenvolva a estrutura antes de produzir o conteúdo",
      "Crie o conteúdo com originalidade e clareza",
      "Revise coerência e alinhamento com o objetivo",
    ],
    "analysis": [
      "Compreenda completamente o tema e os dados disponíveis",
      "Identifique variáveis-chave, padrões e relações",
      "Aplique frameworks analíticos para estruturar o exame",
      "Documente descobertas em cada etapa da análise",
      "Gere insights e recomendações baseados em evidências",
    ],
    "synthesis": [
      "Reúna e revise todas as fontes e perspectivas",
      "Identifique temas comuns e pontos complementares",
      "Desenvolva um framework unificador integrando as fontes",
      "Construa uma narrativa coerente sintetizando as entradas",
      "Valide a síntese contra o material original",
    ],
    "code-generation": [
      "Analise os requisitos e defina especificações técnicas",
      "Planeje a arquitetura e o fluxo de dados",
      "Escreva código limpo e modular com boas práticas",
      "Adicione comentários e documentação essenciais",
      "Considere tratamento de erros e casos extremos",
    ],
    "strategic-planning": [
      "Analise o cenário atual (forças, fraquezas, oportunidades, ameaças)",
      "Defina objetivos claros e mensuráveis",
      "Desenvolva plano de ação com cronograma e marcos",
      "Identifique riscos e estratégias de mitigação",
      "Crie métricas de acompanhamento e avaliação",
    ],
    "document-interpretation": [
      "Leia o documento identificando tipo, propósito e estrutura",
      "Extraia informações-chave e argumentos principais",
      "Identifique significados implícitos e possíveis vieses",
      "Organize as informações em estrutura lógica",
      "Resuma com observações críticas e recomendações",
    ],
  };

  const steps = instructionMap[taskType] || instructionMap["creation"];
  return steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
}

// ========== MAIN PROMPT GENERATOR ==========

export function generatePrompt(config: PromptConfig): GeneratedPrompt {
  const { projectName, projectContext } = config;
  const domain = detectDomain(projectContext);
  const { type: taskType, label: taskLabel } = detectTaskType(projectContext);
  const { persona, description: personaDesc } = detectPersona(projectContext, taskType);
  const outputFormat = detectOutputFormat(projectContext);
  const instructions = generateInstructions(taskType);

  // Build prompt sections
  const sections: string[] = [];

  // Context and Persona
  sections.push(`<context_and_persona>
Você é um ${persona}, ${personaDesc}. Atue com expertise profunda, pensamento estruturado e precisão nas respostas.
</context_and_persona>`);

  // Operational Context
  sections.push(`<operational_context>
PROJETO: ${projectName}
DOMÍNIO: ${domain}
TIPO: ${taskLabel}
Ambiente profissional onde precisão, completude e clareza são essenciais.
</operational_context>`);

  // Objective
  sections.push(`<objective>
${projectContext}
</objective>`);

  // Main Instructions
  sections.push(`<main_instructions>
${instructions}
</main_instructions>`);

  // Constraints
  sections.push(`<constraints>
- NÃO invente fatos ou dados não verificados
- NÃO extrapole além do escopo solicitado
- Seja específico e evite linguagem vaga
- Siga o formato de saída definido
- Se faltar informação, declare explicitamente
- Mantenha tom profissional e adequado ao domínio
- Priorize insights acionáveis e implementáveis
</constraints>`);

  // Output Format
  sections.push(`<output_format>
Entregue a resposta em ${outputFormat}. Use títulos claros, organização lógica e hierarquia visual para garantir legibilidade.
</output_format>`);

  // Quality Criteria
  sections.push(`<quality_criteria>
Antes de entregar, verifique:
✅ Coerência lógica nos argumentos
✅ Completude — todos os aspectos abordados
✅ Clareza — compreensível pelo público-alvo
✅ Acionabilidade — recomendações práticas
✅ Formato — saída conforme especificado
</quality_criteria>`);

  // Anti-hallucination
  sections.push(`<anti_hallucination>
🚫 Não fabrique fatos, citações ou dados fictícios
🚫 Não apresente suposições como fatos
✅ Quando incerto, declare: "Isso necessitaria de verificação..."
✅ Distinga entre fatos, inferências e análise especulativa
</anti_hallucination>`);

  // Assemble full prompt
  let fullPromptText = sections.join("\n\n");

  // Enforce 3000 char limit
  if (fullPromptText.length > 3000) {
    fullPromptText = trimToLimit(fullPromptText, 3000);
  }

  return {
    projectName,
    fullPromptText,
    charCount: fullPromptText.length,
    detectedDomain: domain,
    detectedTaskType: taskLabel,
    detectedPersona: persona,
  };
}

function trimToLimit(text: string, limit: number): string {
  if (text.length <= limit) return text;

  // Try to cut at the last complete XML tag before the limit
  const truncated = text.substring(0, limit);
  const lastClosingTag = truncated.lastIndexOf("</");
  if (lastClosingTag > limit * 0.7) {
    // Find the end of this closing tag
    const tagEnd = truncated.indexOf(">", lastClosingTag);
    if (tagEnd !== -1 && tagEnd < limit) {
      return truncated.substring(0, tagEnd + 1);
    }
  }

  // Fallback: just cut at limit
  return truncated.substring(0, limit - 3) + "...";
}

// ========== INFERENCE CONFIG ==========

export function getInferenceConfig(config: PromptConfig): InferenceConfig {
  const { type: taskType } = detectTaskType(config.projectContext);

  let temperature = "0.4";
  let topP = "0.9";
  const model = "ChatGPT (GPT-4o / GPT-4o mini)";
  let justification = "";

  switch (taskType) {
    case "creation":
      temperature = "0.7";
      topP = "0.95";
      justification =
        "Temperatura mais alta para tarefas criativas — permite saídas diversas e originais no ChatGPT.";
      break;
    case "analysis":
      temperature = "0.3";
      topP = "0.85";
      justification =
        "Temperatura baixa garante análises precisas e consistentes no ChatGPT.";
      break;
    case "synthesis":
      temperature = "0.5";
      topP = "0.9";
      justification =
        "Temperatura moderada equilibra criatividade com precisão para síntese no ChatGPT.";
      break;
    case "code-generation":
      temperature = "0.2";
      topP = "0.85";
      justification =
        "Temperatura baixa garante código determinístico e correto no ChatGPT.";
      break;
    case "strategic-planning":
      temperature = "0.5";
      topP = "0.9";
      justification =
        "Temperatura moderada permite pensamento estratégico inovador com coerência lógica no ChatGPT.";
      break;
    case "document-interpretation":
      temperature = "0.2";
      topP = "0.8";
      justification =
        "Temperatura baixa garante interpretação fiel e precisa de documentos no ChatGPT.";
      break;
    default:
      justification =
        "Configuração equilibrada para tarefas de propósito geral no ChatGPT.";
  }

  return { temperature, topP, recommendedModel: model, justification };
}

export interface DesignTaskOptions {
  goal: 'design' | 'react';
  mode?: 'basic' | 'detailed';
  phase: 'understand' | 'implement';
  source: 'auto' | 'editor' | 'image' | 'prompt';
  patterns: string[];
}

export const getDesignTaskPlan = ({ goal, phase, source, patterns, mode }: DesignTaskOptions) => {
  const needsEditor = source === 'editor' || patterns.includes('reference-images');
  const needed = new Set<string>(['understand']);

  if (phase === 'implement') {
    needed.add('always');
    patterns.forEach((pattern) => {
      if (mode === 'detailed' || !['filtering', 'behavior'].includes(pattern)) {
        needed.add(pattern);
      }
    });
    if (goal === 'react') {
      needed.add('react');
      if (mode === 'detailed') {
        needed.add('behavior');
        needed.add('detailed-react');
      }
    }
    if (patterns.includes('wizard')) {
      needed.add('form');
      needed.add('behavior');
    }
    if (patterns.includes('filtering')) needed.add('data-display');
  } else if (patterns.includes('reference-images')) {
    needed.add('reference-images');
  }

  const contextStep = needsEditor
    ? 'Call get_editor_context and wait for ready=true; read the current document with editorId/version. Use selectedNodes and ordered selectedReferences; fetch only relevant reference images.'
    : source === 'auto'
      ? 'Resolve source from the request. Only editor-owned designs, selections or uploaded references require ready get_editor_context. IDE images/prompts do not require an editor session.'
      : 'Use the supplied IDE image or prompt and existing project evidence. Do not request an editor session unless the user also wants editor reading or writing.';

  const steps = [
    contextStep,
    'Read guidance.required bodies delivered for this goal/source/mode/phase. They define the editable workflow; follow workflow and the target-specific guide. Do not treat needs-project-input as a completed project convention.',
    phase === 'understand'
      ? 'Understand scope and scale first; follow authoring-modes and screen-understanding. Then request details with all observed patterns and selected components.'
      : 'Follow designer-workflow for design or codegen-workflow for react. Prompt/image to React needs no Designer JSON/import/session. Editor-sourced React preserves document semantics. Request taskPhase=verify before completion.',
  ];
  return { needed, needsEditor, steps };
};

import type { z } from 'zod';

import type { patternSchema } from '../constants/toolOptions.js';

export interface DesignTaskOptions {
  goal: 'design' | 'react';
  mode?: 'basic' | 'detailed';
  phase: 'understand' | 'implement';
  source: 'auto' | 'editor' | 'image' | 'prompt';
  patterns: z.infer<typeof patternSchema>[];
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
    'Prefer get_design_contract overview then selected component/guide details in one batch; this legacy plan remains available. Read required guides with this revision; reuse already-read guides only while the revision is unchanged. authoring-modes is authoritative for scope and question budgets.',
    contextStep,
    'For screen generation, use explicitly requested/selected screens; otherwise inspect ALL frames in the current document (or all supplied IDE images). get_design returns the full document, not a filtered package. Keep selected-element edits narrow. Inspect scoped JSON plus available screenshots; use frameId from selectedNodes when resolving selection. Report unresolved out-of-scope targets.',
    'Recognize clear wizard structure even without drawn links: explicit JSON relations take precedence, then numbered steps, shared purpose and project strategy. Read forms/wizard before implementing shared provider/context/stepper, next/back and retained values in BOTH modes. Delivery together or canvas order alone does not prove a wizard. Modal/state variants are not extra steps; ask only if grouping/order remains materially ambiguous.',
    'If mode is not selected, ask Basic (UI and structural form/wizard flow) or Detailed (confirmed behavior/domain/API) and wait; do not choose silently. Keep the choice in subsequent calls.',
    'In BOTH modes, if neither source viewport width nor a card/modal reference width in CSS pixels is reliably known, ask once before choosing layout scale. Image pixel width or a mobile/desktop guess is not proof. If the user does not know, offer an explicit approximate reference without repeating the question.',
    mode === 'detailed'
      ? 'Identify purpose, regions and possible rules; ask only relevant unanswered questions, usually about five and never more than ten TOTAL including common questions. Confirm dependencies, validation, handlers and service states before implementation.'
      : 'Identify purpose, visible content, hierarchy, spacing and structural form/wizard flow across the scoped screens. Ask at most three common questions including mode/width/purpose or ambiguous step grouping. Do not infer field dependencies, validation, business handlers, queries or business rules.',
  ];

  if (phase === 'understand') {
    steps.push('Keep a compact screen brief; do not write code yet. Call start_design_task again with the selected mode, phase=implement and the observed patterns. New patterns require their guides before implementation.');
  } else {
    steps.push(
      'Use get_design_contract overview and batch only used componentTypes plus selected strategy guides in details. Read component authoring guidance; table/List/Tabs/disclosure require data-display. Rediscover if a new pattern appears.',
      'For Designer output, create or preserve semantic JSON and call validate_design; resolve errors. For direct React from an IDE image, editor import and a Designer JSON intermediate are optional; do not invent Designer props.',
      'If the user requested editor review, import_design adds new screens and update_design patches existing nodes. Use fresh editorId/version, wait for applied ACK, do not render by default. Only if the user explicitly requests visual comparison/refinement, read render-feedback and inspect/rerender within that scope.',
    );
    if (goal === 'react') {
      steps.push(
        'Read project architecture/standards/i18n and relevant pattern examples before coding. The owner supplies their rules; do not fill missing architecture with invented imports or new packages.',
        mode === 'detailed'
          ? 'Use data-inference and api-mocks after confirming relevant rules; complete fields, relations and fixtures from project examples. Verify real service contracts or explicitly approved demo contracts.'
          : 'Implement the visible UI/template and structural form/wizard flow using verified project strategy/examples, including provider/context/stepper, next/back and retained field values even when arrows are absent. Do not generate API files, business handlers, validation or dependent-field rules. Do not invent provider imports when the project strategy is missing; report only that integration gap.',
        'Fetch the scaffold asset if needed; verify hash and dry-run before writing. Follow template-completion and completionChecklist within the selected mode; Basic omits API scaffolding, Detailed integrates only confirmed rules.',
        'Read unit-tests and quality-checks after implementation; run existing quality commands and relevant interaction tests; visual capture/refinement is only for explicit user requests. Report incomplete integrations rather than claiming scaffold output is finished.',
      );
    }
  }

  return { needed, needsEditor, steps };
};

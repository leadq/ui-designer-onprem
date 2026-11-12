import type { KnowledgeBundle, GuideEntry } from './knowledge.js';
import { getGuideSummary } from './knowledge.js';
import { getDesignTaskPlan } from './utils/getDesignTaskPlan.js';

export interface GuidanceContext {
  goal: 'design' | 'react';
  source: 'auto' | 'prompt' | 'image' | 'editor';
  mode?: 'basic' | 'detailed';
  phase: 'understand' | 'implement' | 'verify';
  patterns: string[];
}

export const getTaskGuidance = (bundle: KnowledgeBundle, context: GuidanceContext, requestedIds: string[] = []) => {
  const patterns = new Set(context.patterns);
  const known = new Set(bundle.manifest.guides.map(guide => guide.when));
  for (const pattern of patterns) {
    if (!known.has(pattern)) throw new Error(`Unknown pattern: ${pattern}. Rediscover guideIndex.`);
  }
  for (const id of requestedIds) {
    const guide = bundle.manifest.guides.find(entry => entry.id === id);
    if (!guide) throw new Error(`Unknown guide: ${id}`);
    patterns.add(guide.when);
  }
  const { needed } = getDesignTaskPlan({ ...context,
    phase: context.phase === 'verify' ? 'implement' : context.phase, patterns: [...patterns] });
  if (context.goal === 'react' && context.source === 'editor') needed.add('behavior');
  if (context.phase === 'verify') needed.add('after-implementation');
  const matches = (guide: GuideEntry) => {
    if (guide.targets && !guide.targets.includes(context.goal)) return false;
    if (guide.phases && !guide.phases.includes(context.phase)) return false;
    // Unknown source/mode must not silently omit a possibly applicable rule.
    if (guide.sources && context.source !== 'auto' && !guide.sources.includes(context.source)) return false;
    if (guide.modes && context.mode && !guide.modes.includes(context.mode)) return false;
    return guide.when === 'always' || needed.has(guide.when);
  };
  const required = bundle.manifest.guides.filter(matches);
  const content = required.map(guide => ({ ...getGuideSummary(bundle, guide), content: bundle.contents.get(guide.id)!.content }));
  return {
    context: { ...context, patterns: [...patterns] },
    required: content,
    needsProjectInput: required.filter(guide => guide.status === 'needs-project-input').map(guide => guide.id),
    delivery: 'Required rule bodies are included, not just links. Apply them before proceeding. needs-project-input identifies incomplete examples, not confirmed project conventions. This is delivery evidence, not proof of model comprehension.',
  };
};

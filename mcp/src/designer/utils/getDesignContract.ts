import { z } from 'zod';

import { getGuideSections } from './getGuideSections.js';

import { getGuideSummary, getKnowledgeBundle, getSha256 } from '../knowledge.js';
import { getDesignerRuntime } from '../runtime.js';
import { getTaskGuidance, type GuidanceContext } from '../taskGuidance.js';

interface ContractRequest {
  goal?: GuidanceContext['goal'];
  source?: GuidanceContext['source'];
  mode?: GuidanceContext['mode'];
  taskPhase?: GuidanceContext['phase'];
  patterns?: string[];
  adapterId: string;
  phase: 'overview' | 'details';
  contractRevision?: string;
  componentTypes?: string[];
  allComponents: boolean;
  guides: { id: string; sectionIds?: string[] }[];
}

const catalogSchema = z.object({
  schemaVersion: z.number(),
  components: z.array(z.object({ type: z.string() })),
});

export const getDesignContract = async (request: ContractRequest) => {
  const { adapterId, phase, componentTypes, allComponents, guides } = request;
  if (allComponents && componentTypes) throw new Error('Choose componentTypes OR allComponents.');
  if (phase === 'overview' && (componentTypes || allComponents || guides.length)) {
    throw new Error('Read overview first; request selected components/guides with phase details.');
  }
  const bundle = await getKnowledgeBundle();
  const runtime = getDesignerRuntime();
  const summary = runtime.getDesignCatalog(adapterId);
  const { schemaVersion, components } = catalogSchema.parse(summary);
  const fullCatalog = runtime.getDesignCatalog(adapterId, components.map(({ type }) => type));
  // Includes actual adapter metadata, not just Markdown: a prop change invalidates old packets.
  const contractRevision = getSha256(JSON.stringify(fullCatalog) + bundle.revision);
  if (request.contractRevision && request.contractRevision !== contractRevision) {
    throw new Error('Contract revision changed; read overview again before using details.');
  }
  if (phase === 'details' && !request.contractRevision) {
    throw new Error('details requires contractRevision from overview.');
  }
  const getComponentPacket = (catalog: unknown) => Object.fromEntries(
    Object.entries(z.record(z.string(), z.unknown()).parse(catalog)).filter(([key]) =>
      !['authoringContract', 'breakpoints', 'structuralTypes', 'themePolicy'].includes(key)),
  );
  const identity = { format: 'ui-designer/contract-v1', adapterId, schemaVersion,
    bundleVersion: bundle.manifest.version, bundleRevision: bundle.revision, contractRevision };
  const guidance = getTaskGuidance(bundle, {
    goal: request.goal ?? 'design', source: request.source ?? 'auto', mode: request.mode,
    phase: request.taskPhase ?? (phase === 'overview' ? 'understand' : 'implement'),
    patterns: request.patterns ?? [],
  }, guides.map(guide => guide.id));
  if (phase === 'details') {
    const selectedGuides = guides.map(({ id, sectionIds }) => {
      const guide = bundle.manifest.guides.find((entry) => entry.id === id);
      if (!guide) throw new Error(`Unknown guide: ${id}`);
      const content = bundle.contents.get(id)!.content;
      const sections = getGuideSections(content);
      return { ...getGuideSummary(bundle, guide),
        ...(sectionIds ? { sections: [...new Set(sectionIds)].map((sectionId) => {
          const section = sections.find((entry) => entry.id === sectionId);
          if (!section) throw new Error(`Unknown section ${sectionId} in ${id}`);
          return section;
        }) } : { content }),
      };
    });
    return { ...identity, phase, guidance,
      catalog: allComponents ? getComponentPacket(fullCatalog) : componentTypes
        ? getComponentPacket(runtime.getDesignCatalog(adapterId, [...new Set(componentTypes)])) : undefined,
      guides: selectedGuides,
      reuse: 'Keep this packet for this adapter and revision. Request only newly needed components/guide sections. Guide status needs-project-input is not a completed institution strategy.',
    };
  }
  const fieldGuide = bundle.contents.get('json-field-reference');
  if (!fieldGuide) throw new Error('Profile must provide json-field-reference for contract-first authoring.');
  const fieldSections = getGuideSections(fieldGuide.content);
  return { ...identity, phase, guidance, catalog: summary,
    // Existing authoritative field dictionary, not a second hand-maintained JSON model.
    fields: fieldSections.slice(0, 3),
    guideIndex: bundle.manifest.guides.map((guide) => ({ ...getGuideSummary(bundle, guide),
      sections: getGuideSections(bundle.contents.get(guide.id)!.content)
        .map(({ id, title }) => ({ id, title })),
    })),
    workflow: [
      'Apply guidance.required before proceeding. Set goal/source/mode and observed patterns; the editable rules define understanding, Designer and codegen behavior.',
      'Request details for selected componentTypes and patterns using this contractRevision. Newly requested guide topics also include matching mandatory rules. Use taskPhase=verify before completion.',
      'Technical contract and registry semantics remain authoritative. Required content delivery does not prove model comprehension or successful application.',
    ],
    visualReview: { default: 'none', activation: 'explicit-user-request',
      rule: 'Reading a supplied reference image is allowed. Do not capture/render the produced UI or start a visual refinement loop by default. Only when the user requests visual comparison/refinement, read render-feedback and use render_design_frame within that scope. Never claim visual matching from JSON validation.',
      enforcement: 'Agent workflow policy; not a server authorization boundary.' },
  };
};

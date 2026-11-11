import { z } from 'zod';

import { getGuideSections } from './getGuideSections.js';

import { getGuideSummary, getKnowledgeBundle, getSha256 } from '../knowledge.js';
import { getDesignerRuntime } from '../runtime.js';

interface ContractRequest {
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
    return { ...identity, phase,
      catalog: allComponents ? getComponentPacket(fullCatalog) : componentTypes
        ? getComponentPacket(runtime.getDesignCatalog(adapterId, [...new Set(componentTypes)])) : undefined,
      guides: selectedGuides,
      reuse: 'Keep this packet for this adapter and revision. Request only newly needed components/guide sections. Guide status needs-project-input is not a completed institution strategy.',
    };
  }
  const fieldGuide = bundle.contents.get('json-field-reference');
  if (!fieldGuide) throw new Error('Profile must provide json-field-reference for contract-first authoring.');
  const fieldSections = getGuideSections(fieldGuide.content);
  return { ...identity, phase, catalog: summary,
    // Existing authoritative field dictionary, not a second hand-maintained JSON model.
    fields: fieldSections.slice(0, 3),
    guideIndex: bundle.manifest.guides.map((guide) => ({ ...getGuideSummary(bundle, guide),
      sections: getGuideSections(bundle.contents.get(guide.id)!.content)
        .map(({ id, title }) => ({ id, title })),
    })),
    scalePolicy: {
      reference: 'Prefer a clearly bounded region roughly half the screenshot width (modal/card/content panel) whose CSS width the user can easily estimate. Width is preferred to height; reuse any already known measurement rather than asking again. Otherwise use known CSS viewport width OR a known card/modal width in the SAME image plane. If neither is known, ask once for an approximate reference; do not require browser inspect. Reuse given answers. If unknown to the user, explicitly label the agreed approximation.',
      browserFallback: 'If no region width is known, ask for the original screenshot browser viewport width in CSS px (window.innerWidth or document.documentElement.clientWidth), from the same capture size/zoom. Body width can be capped or scrollable and is not automatically the viewport. A screenshot file alone cannot reveal that value; do not inspect an unrelated current tab or claim the old capture dimensions were measured.',
      calculation: 'cssLength = observedImageLength * referenceCssWidth / observedReferenceImageWidth. E.g. modal is 600 image px and about 480 CSS px: a 30 image px gap is about 24 CSS px. Do not mix cropped/scaled screenshots or infer unseen height.',
      layout: 'Interpret ratios as parent/child grouping, row/column, alignment, fill/auto, maxWidth, gap and padding. Use catalog layout keys/native size props; never serialize measured x/y rectangles, screenshot pixels or editor chrome as layout.',
    },
    workflow: [
      'Understand screen purpose, requested scope and scale from the supplied image/prompt/current JSON. Ask only unknown material facts; Basic/Detailed policy remains in authoring-modes.',
      'Choose candidate types by overview names, short descriptions and brief visualHints about visible shape. Hints are recognition clues, not proof of hidden behavior. Request details for components you will use or candidates you are unsure about; recipes are returned only in those selected details. Preserve native slot/compound ownership. Choose strategies by guideIndex title/summary/when/status and observed screen needs; form and dashboard may coexist. Request selected componentTypes and strategy guides/sections together in phase details. Do not load every strategy. allComponents is available only when the full library is actually needed.',
      'For JSON authoring follow catalog.authoringContract.jsonGeneration.steps and styleResolution.sizingRules, then read layout and relevant field sections. Resolve sizing intent and alignment at each target breakpoint before validation; component recipes cannot change shared layout semantics. For React also read react-generation and actual project strategy; custom export renderers/callbacks are not equivalent to spreading JSON props. Do not invent missing native mappings or institution rules.',
      'Construct semantic JSON directly; validate_design is structural validation without rendering. Append/patch only if requested; use fresh live identity/revision and applied/persisted receipt. Existing selections/parents/responsive context and one undo remain mandatory.',
    ],
    visualReview: { default: 'none', activation: 'explicit-user-request',
      rule: 'Reading a supplied reference image is allowed. Do not capture/render the produced UI or start a visual refinement loop by default. Only when the user requests visual comparison/refinement, read render-feedback and use render_design_frame within that scope. Never claim visual matching from JSON validation.',
      enforcement: 'Agent workflow policy; not a server authorization boundary.' },
  };
};

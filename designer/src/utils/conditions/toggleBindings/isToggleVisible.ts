import type { DesignNode } from '@root/types/document'

/** Missing inverse metadata retains the original checked-to-show behavior. */
export const isToggleVisible = (binding: DesignNode['toggleBinding'], targetId: string): boolean =>
  !binding?.hiddenWhenCheckedNodeIds?.includes(targetId)

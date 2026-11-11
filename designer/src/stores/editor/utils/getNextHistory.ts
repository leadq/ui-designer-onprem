import type { PageState } from '@root/stores/editor/pageState'
import { reconcileFlows } from '@root/utils/flows/flowModel'

const MAX_HISTORY = 50

export const getNextHistory = (state: PageState) => {
  reconcileFlows(state.nodes)

  const newHistory = state.history.slice(0, state.historyIndex + 1)

  newHistory.push(JSON.parse(JSON.stringify(state.nodes))) // deep clone

  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift()
  }

  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  }
}

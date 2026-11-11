import { useContext } from 'react'

import { ItemDataContext } from '../context'

export const useItemData = () => useContext(ItemDataContext)

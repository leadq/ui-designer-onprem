import type { ComponentRecipe } from '@root/types/componentContract';

export const singleChoiceRecipe: ComponentRecipe = {
  id: 'single-choice',
  title: 'Bitişik seçeneklerle tek değer seçimi',
  when: 'Bitişik etiketler aynı alanın alternatifleri ve tek seçim davranışı istekten veya mevcut tasarımdan biliniyor.',
  instructions: [
    'Görünen seçenekleri sırasıyla data içine yaz. Her seçeneğin label metnini ve value değerini eşleştir.',
    'Bilinen ilk seçimi defaultValue ile ver. Kontrol, bölmeleri ve seçili görünümü kendisi çizer.',
  ],
  avoid: ['Her öğe ayrı bir eylem çalıştırıyorsa ilgili eylem kontrollerini kullan.'],
  example: {
    id: 'period-choice',
    type: 'segmented',
    props: {
      label: 'Dönem',
      data: [{ value: 'daily', label: 'Günlük' }, { value: 'weekly', label: 'Haftalık' }],
      defaultValue: 'weekly',
    },
    style: {},
    children: [],
  },
};

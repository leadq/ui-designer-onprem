import type { ComponentRecipe } from '@root/types/componentContract';

export const titleInContentRecipe: ComponentRecipe = {
    id: 'title-in-content',
    title: 'İçerik içinde başlıklı kart',
    when: 'Kartta düz bir başlık ve içerik var; ayrı native header bölgesi kanıtı yok.',
    instructions: [
      'Bu adapter başlığı children içindeki Typography olarak taşır.',
      'Native Card.Section veya Card.Header bu registry içinde kayıtlı değildir; type olarak kullanma. Kurum adapterının header slotu varsa kendi tarifini izle.',
    ],
    example: {
      id: 'recipe-card', type: 'card', props: {}, style: { gap: 16 },
      children: [{
        id: 'recipe-card-title', type: 'typography',
        props: { children: 'Hesap bilgileri', fw: 600 }, style: {}, children: [],
      }],
    },
  };

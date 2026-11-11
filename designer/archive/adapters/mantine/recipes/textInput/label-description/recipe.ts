import type { ComponentRecipe } from '@root/types/componentContract';

export const labelDescriptionRecipe: ComponentRecipe = {
    id: 'label-description',
    title: 'Etiket ve yardımcı açıklamalı input',
    images: [{ id: 'default', file: 'label-description.png',
      caption: 'Gerçek Mantine TextInput; label ve description aynı input üzerindedir. Açık tema, varsayılan boyut; 400 CSS px bölge, DPR 1.',
      sha256: '244a13b81c72464a0aea9ac1f71b04bc2785236ca6efc3c30f1e21aa9d282e72', width: 400, height: 110 }],
    when: 'Metin alanının üstünde etiket ve açıklama görünüyor.',
    instructions: [
      'Etiketi props.label, yardımcı metni props.description olarak ver.',
      'Açıklama için ayrı Typography kardeşi oluşturma; yerleşimi native input yönetir.',
    ],
    avoid: ['Bu adapter error veya ReactNode label/description slotu kaydetmiyor; native API desteklese bile bu alanları icat etme.'],
    example: {
      id: 'recipe-input', type: 'textInput',
      props: { label: 'Ad soyad', description: 'Kimliğinizdeki biçimiyle yazın.', placeholder: 'Ad soyad' },
      style: {}, children: [],
    },
  };

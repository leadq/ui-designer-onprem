export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Keep editable drafts intact while native controls receive valid, unique options. */
export const getSelectOptions = (data: unknown): SelectOption[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  const options: SelectOption[] = [];
  const values = new Set<string>();

  for (const item of data as unknown[]) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      continue;
    }

    const option = item as Record<string, unknown>;

    if (
      typeof option.value !== 'string' ||
      typeof option.label !== 'string' ||
      !option.label ||
      values.has(option.value)
    ) {
      continue;
    }

    values.add(option.value);

    options.push({
      ...option,
      value: option.value,
      label: option.label,
      disabled: option.disabled === true,
    });
  }

  return options;
};

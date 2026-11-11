export const getResult = async (work: () => unknown | Promise<unknown>) => {
  try {
    return { content: [{ type: 'text' as const, text: JSON.stringify(await work()) }] };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text' as const,
          text: error instanceof Error ? error.message : 'Designer request failed',
        },
      ],
    };
  }
};

export const getGuideSections = (content: string) => {
  const lines = content.split('\n');
  const headings: { title: string; line: number }[] = [];
  let fence: string | undefined;

  lines.forEach((line, index) => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (
        marker[1][0] === fence[0] && marker[1].length >= fence.length
        && line.slice(marker[0].length).trim() === ''
      ) fence = undefined;
      return;
    }
    const heading = !fence && line.match(/^## (.+)$/);
    if (heading) headings.push({ title: heading[1].trim(), line: index });
  });

  return headings.map((heading, index) => ({
    id: `section-${index}`,
    title: heading.title,
    content: lines.slice(heading.line, headings[index + 1]?.line).join('\n').trimEnd(),
  }));
};

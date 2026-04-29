import React, { useMemo } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';

type MatchIndex = readonly [number, number];

export type HighlightedTextProps = Omit<ThemedTextProps, 'children'> & {
  text: string;
  /** Fuse match indices are inclusive: [start, end]. */
  indices?: readonly MatchIndex[];
  highlightStyle?: StyleProp<TextStyle>;
};

function normalizeIndices(indices?: readonly MatchIndex[]) {
  if (!indices || indices.length === 0) return [];

  // Sort + merge overlaps (Fuse can return multiple ranges).
  const sorted = [...indices]
    .map(([start, end]) => [Math.max(0, start), Math.max(0, end)] as const)
    .sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (!last) {
      merged.push([start, end]);
      continue;
    }

    // Overlapping / adjacent
    if (start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
      continue;
    }

    merged.push([start, end]);
  }

  return merged;
}

export function HighlightedText({
  text,
  indices,
  highlightStyle,
  ...textProps
}: HighlightedTextProps) {
  const { style, type, lightColor, darkColor } = textProps;
  const merged = useMemo(() => normalizeIndices(indices), [indices]);

  if (!merged.length) {
    return <ThemedText {...textProps}>{text}</ThemedText>;
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  merged.forEach(([start, end], idx) => {
    const safeStart = Math.min(Math.max(start, 0), text.length);
    const safeEnd = Math.min(Math.max(end, -1), text.length - 1);

    if (cursor < safeStart) {
      parts.push(text.slice(cursor, safeStart));
    }

    const highlighted = text.slice(safeStart, safeEnd + 1);
    parts.push(
      <ThemedText
        key={`hl-${idx}-${safeStart}-${safeEnd}`}
        type={type}
        lightColor={lightColor}
        darkColor={darkColor}
        style={[style, highlightStyle]}
      >
        {highlighted}
      </ThemedText>,
    );

    cursor = safeEnd + 1;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <ThemedText {...textProps}>{parts}</ThemedText>;
}


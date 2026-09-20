import React, { useMemo } from 'react';
import katex from 'katex';

export default function MathFormula({ math, block = false, className = '' }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (e) {
      console.error(e);
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`my-3 overflow-x-auto text-amber-200 py-1 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block text-amber-300 font-serif px-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

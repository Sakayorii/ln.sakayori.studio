/* Remark plugin: true drop cap for the chapter's opening paragraph.
   Finds the first letter of the first paragraph, skipping leading dialogue
   punctuation (「 ―― …), and wraps it in <span class="dropcap">.
   Works even when chapters open mid-dialogue, which is the norm for LNs. */
export default function remarkDropcap() {
  function firstTextNode(node) {
    if (!node || !node.children) return null;
    for (const child of node.children) {
      if (child.type === 'text') return child;
      const found = firstTextNode(child);
      if (found) return found;
    }
    return null;
  }
  return (tree) => {
    for (const node of tree.children || []) {
      if (node.type !== 'paragraph') continue;
      const textNode = firstTextNode(node);
      if (!textNode || !textNode.value) continue;
      const m = textNode.value.match(/^([\s\S]*?)(\p{L})/u);
      if (!m) continue;
      const idx = m[1].length;
      const letter = m[2];
      const before = textNode.value.slice(0, idx);
      const after = textNode.value.slice(idx + 1);
      const ti = node.children.indexOf(textNode);
      const replacement = [];
      if (before) replacement.push({ type: 'text', value: before });
      replacement.push({ type: 'html', value: `<span class="dropcap">${letter}</span>` });
      if (after) replacement.push({ type: 'text', value: after });
      node.children.splice(ti, 1, ...replacement);
      break; // opening paragraph only
    }
  };
}

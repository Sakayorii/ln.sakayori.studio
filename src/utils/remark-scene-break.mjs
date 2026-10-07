/* Remark plugin: transforms single-paragraph △▼△▼△▼△ marker into <hr class="scene-break" /> */
export default function remarkSceneBreak() {
  const MARK = '△▼△▼△▼△';
  function visit(node) {
    if (!node || !node.children) return;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (
        child.type === 'paragraph' &&
        child.children &&
        child.children.length === 1 &&
        child.children[0].type === 'text' &&
        child.children[0].value.trim() === MARK
      ) {
        node.children[i] = { type: 'html', value: '<hr class="scene-break" />' };
      } else {
        visit(child);
      }
    }
  }
  return (tree) => visit(tree);
}

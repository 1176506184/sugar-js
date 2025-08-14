export const nodeOps = {
  insert: (child: Element, parent: Element, anchor: Element | null) => {
    parent.insertBefore(child, anchor || null);
  },

  remove: (child: { parentNode: any }) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  parentNode: (node: { parentNode: Element | null }) => node.parentNode as Element | null,
};

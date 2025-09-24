type Node = {
  code: string;
  children?: Node[];
};

export const buildPaths = (nodes: Node[]) => {
  const paths: string[] = [];

  for (const node of nodes) {
    if (node.code) {
      //   for (const child of node.children) {
      paths.push(`${node.code}/`);
      //   }
    }
  }

  return paths;
};

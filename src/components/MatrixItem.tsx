function MatrixItem({
  code,
  endPoint,
  title,
  icon,
  color,
}: {
  code: string;
  endPoint: string;
  title: string;
  icon: string;
  color: string;
}) {
  return <div>{endPoint}</div>;
}

export default MatrixItem;

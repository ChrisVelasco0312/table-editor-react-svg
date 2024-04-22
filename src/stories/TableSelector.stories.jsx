import TableSelector from "../components/TableSelector";

export const Basic = () => {
  return (
    <TableSelector
      width={500}
      height={800}
      onSelectionComplete={(data) => console.log(data)}
    />
  );
};

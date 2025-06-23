const FilterBadge = ({ content }: { content: string }) => {
  return (
    <div className="bg-primary-200 p-2 rounded-full">
      <p className="text-sm">{content}</p>
    </div>
  );
};

export default FilterBadge;

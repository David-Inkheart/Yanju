function paginate({ records, totalItems, page, limit }: { records: any[]; totalItems: number; page: number; limit: number }) {
  const currentPage = page || 1;
  const totalPages = Math.ceil(totalItems / limit);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;

  return {
    pagination: {
      currentPage,
      nextPage,
      previousPage,
      totalPages,
      totalItems,
    },
    records,
  };
}

export default paginate;

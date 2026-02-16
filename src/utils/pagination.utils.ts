export const paginationMetadata = (
  pageNum: number,
  pageLimit: number,
  totalCount: number,
) => {
  const totalPages = Math.ceil(totalCount / pageLimit);

  return {
    total: totalCount,
    totalPages: totalPages,
    page: pageNum,
    nextPage: pageNum < totalPages ? pageNum + 1 : null,
    prevPage: pageNum > 1 ? pageNum - 1 : null,
    hasPrevPage: pageNum > 1 ? true : false,
    hasNextPage: pageNum < totalPages ? true : false,
  };
};

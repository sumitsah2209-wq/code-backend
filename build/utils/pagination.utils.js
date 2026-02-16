"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationMetadata = void 0;
const paginationMetadata = (pageNum, pageLimit, totalCount) => {
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
exports.paginationMetadata = paginationMetadata;

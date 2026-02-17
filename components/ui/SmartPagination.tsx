"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

interface TablePaginationProps {
  total: number;
  pageSize?: number;
  siblingCount?: number;
}

export function SmartPagination({
  total,
  pageSize = 10,
  siblingCount = 1,
}: TablePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumberFormatter = new Intl.NumberFormat("fa-IR");

  const currentParams = new URLSearchParams(searchParams?.toString() || "");
  const parsedPage = Number(currentParams.get("page"));
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    const params = new URLSearchParams(currentParams.toString());
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const startPage = Math.max(0, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    if (startPage > 0) pages.push(0);
    if (startPage > 1) pages.push("ellipsis");

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 2) pages.push("ellipsis");
    if (endPage < totalPages - 1) pages.push(totalPages - 1);

    return pages;
  };

  return (
    <Pagination
      className=" py-3 flex justify-center border-t"
      aria-label="Table Pagination"
    >
      <PaginationContent dir="ltr">
        <PaginationItem>
          <button
            disabled={currentPage === 0}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaginationPrevious
              className="font-medium text-xs"
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </button>
        </PaginationItem>

        {getPageNumbers().map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
                className="transition w-fit h-fit p-1 px-2 flex items-center justify-center hover:bg-blue-50 leading-6 cursor-pointer font-medium text-xs"
              >
                {pageNumberFormatter.format(page + 1)}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <button
            disabled={currentPage + 1 >= totalPages}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaginationNext
              className="font-medium text-xs"
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

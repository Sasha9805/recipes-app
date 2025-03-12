import React from "react";
import "./pagination.css";

interface PaginationProps {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	totalPages,
	currentPage,
	onPageChange,
}) => {
	const getPageNumbers = (): (number | string)[] => {
		if (totalPages <= 10) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		} else {
			const pages: (number | string)[] = [];
			for (let i = 1; i <= 7; i++) {
				pages.push(i);
			}

			if (currentPage > 7 && currentPage < totalPages) {
				pages.push("...", currentPage, "...");
			} else {
				pages.push("...");
			}

			pages.push(totalPages);
			return pages;
		}
	};

	const pages = getPageNumbers();

	return (
		<div className="pagination">
			<button
				className="pagination-arrow"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				«
			</button>

			{pages.map((page) => {
				if (page === "...") {
					return (
						<span key={page} className="pagination-ellipsis">
							{page}
						</span>
					);
				}
				return (
					<button
						key={page}
						onClick={() => onPageChange(page as number)}
						className={`pagination-button ${
							currentPage === page ? "active" : ""
						}`}
					>
						{page}
					</button>
				);
			})}

			<button
				className="pagination-arrow"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				»
			</button>
		</div>
	);
};

export default Pagination;

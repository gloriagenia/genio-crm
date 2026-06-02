type PaginationProps = {
    currentPage: number;
    totalPages: number;

    onFirst:() => void;
    onPrev:() => void;
    onNext:() => void;
    onLast:() => void;
};

export default function Pagination({
    currentPage,
    totalPages,

    onFirst,
    onPrev,
    onNext,
    onLast,
}: PaginationProps) {
    return (
        <div className="flex items-center gap-3">

            <button onClick={onFirst}
            disabled={currentPage === 1}
            className="
            border
            px-3
            py-1
            rounded
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
            ">
                {"<<"}
            </button>

            <button
                onClick={onPrev}
                disabled={currentPage===1}
                className="
                border 
                px-3 
                py-1 
                rounded
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed">
                Prev
            </button>

            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={onNext}
                disabled={currentPage === totalPages}
                className="
                border 
                px-3 
                py-1 
                rounded
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
                ">
                    Next
            </button>

            <button
                onClick={onLast}
                disabled={currentPage === totalPages}
                className="
                border
                px-3
                py-1
                rounded
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
                ">
                {">>"}
            </button>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import axios from "axios";

const PaginatedList = () => {
    const [data, setData] = useState([]); // State để lưu dữ liệu từ BE
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 10; // Số lượng mục hiển thị mỗi trang

    // Gọi API lấy dữ liệu từ BE
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://api.example.com/items"); // Thay bằng URL của bạn
                setData(response.data); // Lưu dữ liệu từ BE vào state
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

    
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Xử lý khi chuyển trang
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <h1>Danh sách phân trang</h1>
            <ul>
                {currentData.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(data.length / itemsPerPage)}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

// Thành phần Pagination để hiển thị các nút chuyển trang
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    style={{
                        fontWeight: currentPage === index + 1 ? "bold" : "normal",
                    }}
                    onClick={() => onPageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default PaginatedList;

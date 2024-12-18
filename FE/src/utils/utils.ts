export const denormalizeTextAreaContent = (content: string): string => {
    if (!content) return '';  // Nếu content rỗng hoặc null, trả về chuỗi rỗng

    console.log("Before processing: ", content); // In ra trước khi xử lý

    // Thực hiện thay thế các ký tự đặc biệt
    const processedContent = content
        .replace(/\\r\\n/g, '<br/>')  // Thay thế \r\n bằng <br />
        .replace(/\\n/g, '<br/>')     // Thay thế \n bằng <br />
        .replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');  // Thay thế \t bằng 4 khoảng trắng

    console.log("After processing: ", processedContent); // In ra sau khi xử lý

    return processedContent;
};


export function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
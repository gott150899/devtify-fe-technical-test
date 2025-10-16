import type { PagingBody, PagingFormatBody } from "../types"

const formatPagingBody = (body: PagingBody): PagingFormatBody => {
    const { pageIndex, pageSize } = body;
    const realPageIndex = pageIndex - 1;
    const resultPageIndex =  realPageIndex <= 0 ? 0 : realPageIndex;

    return {
        nativePageIndex: pageIndex,
        nativePageSize: pageSize,
        serverPageIndex: resultPageIndex,
        serverPageSize: pageSize,
        clientPageIndex: resultPageIndex + 1,
        clientPageSize: pageSize,
        start: resultPageIndex * pageSize,
        end: (resultPageIndex * pageSize) + pageSize,
    }
}

const generateRandomDate = (startYear: number, endYear: number) => {
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);

    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

    return randomDate;
};

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: number;
  
  return (...args: any[]) => {
    clearTimeout(timer);
    
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const formatDateClient = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const appUtils = {
    formatPagingBody, generateRandomDate, debounce, formatDateClient
}
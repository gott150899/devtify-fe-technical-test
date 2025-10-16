import { useEffect, useState } from "react"
import type { MockupResponse, PagingBody, PagingResponse, SortFilterBody } from "../types";
import { appUtils, CONSTANT } from "../utils";

export const useMockup = () => {
    const [data, setData] = useState<MockupResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const onLoadData = () =>{
            setLoading(true);

            fetch(CONSTANT.mockupUrl)
                .then(resp => resp.json())
                .then((resp: MockupResponse[]) => resp.map((x, i) => ({...x, customId: (i + 1), createdDate: appUtils.generateRandomDate(1990, 2025)})))
                .then(resp => setData(resp))
                .finally(() => setLoading(false));
        }
        onLoadData();
    }, [])

    const onSimulateCallApi = (body: PagingBody, search?: SortFilterBody) => {
        setLoading(true);

        const { start, end, clientPageIndex, clientPageSize } = appUtils.formatPagingBody(body);
        const { hasFilter, hasSort, filters, sort } = appUtils.formatSortFilterBody(search);

        return new Promise<PagingResponse<MockupResponse>>((resolve) => {
            setTimeout(() => {
                let reponseData = [...data];
                // This filters and sort just apply for demo not use it for PRODUCTION
                if(hasFilter){
                    reponseData = reponseData.filter(item => {
                        return Object.entries(filters).some(([key, value]) => {
                            const itemValue = item[key as keyof MockupResponse];

                            if(typeof itemValue === 'string' && typeof value === 'string'){
                                return itemValue.toLowerCase().includes(value.toLowerCase());
                            }
                            return itemValue === value;
                        })
                    })
                }
                if(hasSort){
                    // Custom more sort condition
                    switch(sort){
                        case 'increasing version':
                            reponseData.sort((a, b) => a.version - b.version);
                            break;
                        case 'descending version':
                            reponseData.sort((a, b) => b.version - a.version);
                            break;
                    }
                }

                const dataPaging = reponseData.slice(start, end);

                const _hasNext = reponseData.length > end;
                const response: PagingResponse<MockupResponse> = {
                    data: dataPaging,
                    hasPrev: start !== 0,
                    hasNext: _hasNext,
                    isComplteted: !_hasNext,
                    pageIndex: clientPageIndex,
                    pageSize: clientPageSize,
                    totalItem: reponseData.length
                }
                resolve(response);
                setLoading(false);
            }, CONSTANT.mockupResponseTime);
        });
    }

    return {
        isStable: data.length > 0,
        loading,
        onSimulateCallApi
    }
}
import { useEffect, useState } from "react"
import type { MockupResponse, PagingBody, PagingResponse } from "../types";
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

    const onSimulateCallApi = (body: PagingBody) => {
        const { start, end, clientPageIndex, clientPageSize } = appUtils.formatPagingBody(body);

        setLoading(true);

        return new Promise<PagingResponse<MockupResponse>>((resolve) => {
            setTimeout(() => {
                const dataPaging = data.slice(start, end);

                const _hasNext = data.length > end;
                const response: PagingResponse<MockupResponse> = {
                    data: dataPaging,
                    hasPrev: start !== 0,
                    hasNext: _hasNext,
                    isComplteted: !_hasNext,
                    pageIndex: clientPageIndex,
                    pageSize: clientPageSize,
                    totalItem: data.length
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
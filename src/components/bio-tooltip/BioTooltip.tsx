import { Tooltip } from "antd"

type BioTooltipProps = {
    textContent: string
}

export const BioTooltip = ({ textContent }: BioTooltipProps) => {
    return(
        <Tooltip title={textContent}>
            <span className="line-clamp-2">{textContent}</span>
        </Tooltip>
    )
}
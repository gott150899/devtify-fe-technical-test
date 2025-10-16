import { Tag } from "antd";

type TagVersionProps = {
    version: number;
}

export const TagVersion = ({ version }: TagVersionProps) => {
    if(version <= 2){
        return <Tag color="red">{version}</Tag>
    }
    if(version <= 4){
        return <Tag color="cyan">{version}</Tag>
    }
    if(version <= 6){
        return <Tag color="geekblue">{version}</Tag>
    }

    return <Tag color="green">{version}</Tag>
}
import { Tooltip } from "antd";
import styles from "./ActionBox.module.css";

type ActionBoxProps = {
    children: React.ReactNode;
    tooltip?: string;
    color?: string;
    hoverColor?: string;
    onClick?: () => void;
}

export const ActionBox = ({ children, tooltip, color, hoverColor, onClick }: ActionBoxProps) => {

    const varStyles = {
        '--color': color || '#ccc',
        '--hover-color': hoverColor || color || '#ccc'
    } as React.CSSProperties;

    const handleBtnClick = () =>{
        onClick?.();
    }

    return(
        <Tooltip title={tooltip}>
            <button style={varStyles} onClick={handleBtnClick} className={`${styles.action__container} flex-center`}>{children}</button>
        </Tooltip>
    )
}
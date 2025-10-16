import { ConfigProvider } from "antd";

type AppProviderProps = {
    children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
    return(
        <ConfigProvider>{children}</ConfigProvider>
    )
}

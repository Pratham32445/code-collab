import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";


const Sidebar = ({ Structure }) => {

    return (
        <SidebarProvider>
            <AppSidebar structure={Structure}/>
        </SidebarProvider>
    )
}

export default Sidebar
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function MainLayout({children,}:
    {children:React.ReactNode;
    })
    {
        return(
            <div className="flex h-screen"><Sidebar /> 
                <div className="flex-1 flex flex-col"><Topbar/>
                    <main className="flex-1 p-6 overflow-auto">{children}
                    </main>
                </div>
            </div>
        )
    }

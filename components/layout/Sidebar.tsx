export default function Sidebar(){
    return(
        <aside className="w-64 border-r p-4">
            <h1 className="text-xl font-bold mb-6">
                Genio CRM
            </h1>
            <nav className="flex flex-col gap-3">
                <a href="/dashboard">Dashboard</a>
                <a href="/contacts">Contacts</a>
                <a href="/leads">Leads</a>
                <a href="/inquiries">Inquiries</a>
                <a href="/listings">Listings</a>
                <a href="canvassing">Canvassing</a>
                <a href="properties">Properties</a>
            </nav>
        </aside>
    )
}
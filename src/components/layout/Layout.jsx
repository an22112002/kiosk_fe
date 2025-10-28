import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
export default function Layout() {
    return (
        <>
            <header>
                <Header />
            </header>

            {/* Nội dung chính các trang */}
            <main className="flex-1 pb-20">
                <Outlet />
            </main>

            <footer>
                <Footer />
            </footer>
        </>
    )
}
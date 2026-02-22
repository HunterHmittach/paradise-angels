"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-provider";
import { useCart } from "./cart/CartContext";

export default function Navbar({ setCartOpen }: { setCartOpen: (v: boolean) => void }) {
    
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { cart } = useCart(); // <-- CART WERKT NU!

    function linkClass(path: string) {
        return pathname === path
            ? "text-yellow-300 font-semibold underline underline-offset-4"
            : "hover:text-yellow-300 transition";
    }

    async function handleLogout() {
        await logout();
        router.push("/admin/login");
    }

    return (
        <nav className="flex items-center justify-between px-6 py-6 bg-black text-white">
            <h1 className="text-2xl font-semibold">Paradise Angels</h1>

            <div className="hidden md:flex gap-10 text-lg items-center">
                <Link href="/" className={linkClass("/")}>Home</Link>
                <Link href="/about" className={linkClass("/about")}>About</Link>
                <Link href="/shop" className={linkClass("/shop")}>Shop</Link>
                <Link href="/contact" className={linkClass("/contact")}>Contact</Link>

                {/* ADMIN LINK – alleen tonen als ingelogd */}
                {user && (
                    <Link href="/admin" className={linkClass("/admin")}>Admin</Link>
                )}

                {/* LOGIN / LOGOUT */}
                {!user ? (
                    <Link href="/admin/login" className="text-yellow-300">Login</Link>
                ) : (
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
                        Logout
                    </button>
                )}

                {/* CART BUTTON */}
                <button
                    onClick={() => setCartOpen(true)}
                    className="relative"
                >
                    Cart

                    {/* BADGE */}
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
}

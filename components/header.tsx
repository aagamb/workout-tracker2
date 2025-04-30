import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"

export async function Header() {

    return (
        <header className="sticky top-0 z-50 px-4 py-3 border-b bg-background/60 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/workouts" className="flex items-center gap-2">
                        Workout Tracker
                    </Link>
                    <nav className="flex items-center gap-2">
                        <Link href="/workouts" className="hover:underline">Workouts</Link>
                    </nav>
                </div>

                <UserButton />
            </div>
        </header>
    )
}

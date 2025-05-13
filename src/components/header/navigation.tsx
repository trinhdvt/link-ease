"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navigation() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "Shorten URL", label: "Shorten URL", href: "/" },
    { id: "Reveal URL", label: "Reveal URL", href: "/reveal" },
  ];

  return (
    <nav className="flex items-center">
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden mr-4"
        aria-label="Toggle menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-6 w-6 text-foreground" />
      </button>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-8">
        {navItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={cn(
                "relative py-5 px-1 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "text-foreground hover:text-muted-foreground",
              )}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-md md:hidden">
          <ul className="py-2 px-4">
            {navItems.map((item) => (
              <li key={item.id} className="py-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "text-sm font-medium",
                    pathname === item.href ? "text-primary" : "text-foreground",
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

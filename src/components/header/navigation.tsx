"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
        <div className="absolute top-16 left-0 right-0 bg-muted/50 border-b shadow-md md:hidden">
          <ul className="py-2 px-4">
            {navItems.map((item) => (
              <li key={item.id} className="py-2">
                <Link
                  href={item.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "text-sm font-medium",
                    pathname === item.href ? "text-primary" : "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

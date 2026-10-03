"use client";

import { useState } from "react";
import { Button, Dropdown, Header, Label } from "@heroui/react";
import { Bars } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";

type SidebarLink = {
  name: string;
  href: string;
  icon?: ComponentType<{
    width?: number | string;
    height?: number | string;
    className?: string;
  }>;
};

type MobileSidebarProps = {
  links: SidebarLink[];
};

export default function MobileSidebar({
  links,
}: MobileSidebarProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(),
  );

  const router = useRouter();

  return (
    <div className="lg:hidden flex justify-between items-center pr-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/assats/rokomary-distribution.svg"
          alt="Rokomary Distribution Logo"
          className="h-19 w-auto object-contain"
        />
      </Link>

      {/* Mobile Menu */}
      <Dropdown>
        <Button
          isIconOnly
          aria-label="Menu"
          variant="ghost"
        >
          <Bars width={32} height={32} />
        </Button>

        <Dropdown.Popover className="min-w-[240px]">
          <Dropdown.Menu
            selectedKeys={selected}
            selectionMode="single"
            onSelectionChange={(keys) => {
              if (keys === "all") {
                setSelected(new Set());
                return;
              }

              setSelected(new Set(keys));
            }}
          >
            <Dropdown.Section>
              <Header>Admin Menu</Header>

              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <Dropdown.Item
                    key={link.href}
                    id={link.href}
                    textValue={link.name}
                    onAction={() => router.push(link.href)}
                  >
                    <Dropdown.ItemIndicator />

                    <div className="flex items-center gap-3">
                      {Icon && (
                        <Icon
                          width={20}
                          height={20}
                        />
                      )}

                      <Label>{link.name}</Label>
                    </div>
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
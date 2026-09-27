"use client";

import { useState } from "react";
import { Button, Dropdown, Header, Label } from "@heroui/react";
import { Bars } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MobileSidebar({ links }) {
  const [selected, setSelected] = useState(new Set());
  const router = useRouter();

  return (
    <div className="lg:hidden flex justify-between items-center pr-10">
      <Link href="/" className="flex items-center gap-2">
            <img
              src="/assats/rokomary-distribution.svg"
              alt="Rokomary Distribution Logo"
              className="h-19 w-auto object-contain"
            />
          </Link>
      <Dropdown className="">
        <Button isIconOnly aria-label="Menu" variant="light">
          <Bars size={40} />
        </Button>

        <Dropdown.Popover className="min-w-[240px]">
          <Dropdown.Menu
            selectedKeys={selected}
            selectionMode="single"
            onSelectionChange={setSelected}
          >
            <Dropdown.Section>
              <Header>Freelancer Menu</Header>

              {links.map((link) => (
                <Dropdown.Item
                  key={link.href}
                  id={link.href}
                  textValue={link.name}
                  onAction={() => router.push(link.href)}
                >
                  <Dropdown.ItemIndicator />

                  <div className="flex items-center gap-3">
                    {link.icon && <link.icon />}
                    <Label>{link.name}</Label>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
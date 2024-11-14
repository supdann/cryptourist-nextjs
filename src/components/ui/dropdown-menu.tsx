"use client";

import { Dropdown, DropdownTrigger, DropdownMenu as NextUIDropdownMenu, DropdownItem } from "@nextui-org/react";

// Re-export NextUI components with our preferred names
export const DropdownMenu = Dropdown;
export const DropdownMenuTrigger = DropdownTrigger;
export const DropdownMenuContent = NextUIDropdownMenu;
export const DropdownMenuItem = DropdownItem;

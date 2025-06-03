'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface SideBarContentProps {
  key: string;
  link: string;
  label: string;
  subItems?: SideBarContentProps[];
}

interface LayoutsidebarProps {
  sidebarContent: SideBarContentProps[];
}

export const Layoutsidebar: React.FC<LayoutsidebarProps> = ({ sidebarContent }) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleSubmenu = (key: string) => {
    if (openMenus.includes(key)) {
      setOpenMenus(openMenus.filter((menuKey) => menuKey !== key));
    } else {
      setOpenMenus([...openMenus, key]);
    }
  };

  return (
    <aside className="theme-bg--white lg:px-12 xl:px-[4.5rem] pt-[3.5rem] px-8 transition-all duration-300 ease-in-out min-h-screen">
      <ul className="space-y-6">
        {sidebarContent?.map((item) => (
          <li key={item.key}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => toggleSubmenu(item.key)}
                  className={`block rounded hover:theme-text--primary hover:font-medium text-lg theme-text--sub ${
                    pathname.startsWith(item.link) ? 'font-medium theme-text--primary' : ''
                  }`}
                >
                  {item.label}
                </button>

                {openMenus.includes(item.key) && (
                  <ul className="pl-6 space-y-4 mt-3">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.key}>
                        <Link
                          href={subItem.link}
                          className={`block rounded hover:theme-text--primary hover:font-medium text-lg theme-text--sub ${
                            pathname === subItem.link ? 'font-medium theme-text--primary' : ''
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href={item.link}
                className={`block rounded hover:theme-text--primary hover:font-medium text-lg theme-text--sub ${
                  pathname === item.link ? 'font-medium theme-text--primary' : ''
                }`}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

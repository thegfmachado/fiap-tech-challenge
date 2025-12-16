import type { Meta, StoryObj } from '@storybook/react';
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';

export default {
  title: 'NavigationMenu',
  component: NavigationMenu,
  args: {
    viewport: false,
  }
} satisfies Meta<typeof NavigationMenu>;

export const Default: StoryObj<typeof NavigationMenu> = {
  render: function Default(props: React.ComponentProps<typeof NavigationMenu>) {
    return (
      <NavigationMenu {...props}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Hover me!</NavigationMenuTrigger>
            <NavigationMenuContent className="p-4 w-[200px]">
              <NavigationMenuLink className="block">
                About Us
              </NavigationMenuLink>
              <NavigationMenuLink className="block">
                Careers
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>I can be hovered</NavigationMenuTrigger>
            <NavigationMenuContent className="p-4 w-[200px]">
              <NavigationMenuLink className="block">
                Blog
              </NavigationMenuLink>
              <NavigationMenuLink className="block">
                Documentation
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    );
  },
};

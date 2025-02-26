"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Circle, Coffee, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-600 transition-colors",
            className
        )}
        {...props}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
));
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
              "z-50 w-56 bg-white rounded-md shadow-lg border border-gray-200 p-2",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              className
          )}
          {...props}
      />
    </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors cursor-pointer",
            "focus:bg-gray-100 focus:outline-none",
            className
        )}
        {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn("my-1 h-px bg-gray-200", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export default function CoffeeShopDropdown() {
  return (
      <DropdownMenu>
        {/* 드롭다운 트리거 */}
        <DropdownMenuTrigger>
          <User className="h-5 w-5" />
          My Account
        </DropdownMenuTrigger>

        {/* 드롭다운 내용 */}
        <DropdownMenuContent>
          {/* 사용자 정보 */}
          <DropdownMenuItem>
            <Coffee className="h-4 w-4 text-gray-500" />
            <span>원두 구매</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShoppingCart className="h-4 w-4 text-gray-500" />
            <span>장바구니</span>
          </DropdownMenuItem>

          {/* 구분선 */}
          <DropdownMenuSeparator />

          {/* 마이페이지 링크 */}
          <DropdownMenuItem>
            <User className="h-4 w-4 text-gray-500" />
            <span>내 정보</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Circle className="h-4 w-4 text-gray-500" />
            <span>주문 내역</span>
          </DropdownMenuItem>

          {/* 구분선 */}
          <DropdownMenuSeparator />

          {/* 로그아웃 버튼 */}
          <DropdownMenuItem onClick={() => alert("로그아웃 되었습니다.")}>
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
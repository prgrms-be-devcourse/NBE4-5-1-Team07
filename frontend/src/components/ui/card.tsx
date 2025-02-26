"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

interface CoffeeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    roastLevel?: "light" | "medium" | "dark"; // 로스팅 레벨
    isNew?: boolean; // 신규 상품 여부
    originCountry?: string; // 원산지 국가
    imageSrc?: StaticImageData | string; // 이미지 경로
}

const Card = React.forwardRef<HTMLDivElement, CoffeeCardProps>(
    (
        {
            className,
            roastLevel = "medium",
            isNew = false,
            originCountry,
            imageSrc,
            ...props
        },
        ref
    ) => (
        <div
            ref={ref}
            className={cn(
                "group relative rounded-2xl border-2 border-sky-200 bg-white shadow-lg",
                "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                "hover:border-sky-300",
                className
            )}
            {...props}
        >
            {/* 배지 영역 */}
            <div className="absolute top-3 left-3 flex gap-2">
                {isNew && (
                    <span className="px-2 py-1 bg-sky-500 text-xs font-bold text-white rounded-full">
            NEW
          </span>
                )}
                {originCountry && (
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full">
            {originCountry}
          </span>
                )}
            </div>

            {/* 로스팅 레벨 표시 */}
            <div className="absolute top-3 right-3 flex items-center">
                {[...Array(3)].map((_, i) => (
                    <span
                        key={i}
                        className={cn(
                            "w-2 h-2 rounded-full ml-1",
                            i < ({ light: 1, medium: 2, dark: 3 }[roastLevel] || 0)
                                ? "bg-sky-500"
                                : "bg-sky-200"
                        )}
                    />
                ))}
            </div>

            {/* 커피 이미지 섹션 */}
            {imageSrc && (
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                    <Image
                        src={imageSrc}
                        alt="coffee beans"
                        layout="fill"
                        objectFit="cover"
                        className="transition-opacity duration-300 group-hover:opacity-90"
                    />
                </div>
            )}

            {props.children}
        </div>
    )
);

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 pt-4 pb-2", className)} {...props} />
));

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "font-serif text-xl font-bold text-sky-900 truncate",
            className
        )}
        {...props}
    />
));

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn(
            "text-sm text-sky-700 line-clamp-2 min-h-[40px]",
            className
        )}
        {...props}
    />
));

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { price?: number; stock?: number }
>(({ className, price, stock, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-2", className)} {...props}>
        {price !== undefined && (
            <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-sky-900">
          {price.toLocaleString()}원
        </span>
                <span className="text-sm text-sky-400 line-through">
          {(price * 1.2).toLocaleString()}원
        </span>
            </div>
        )}

        {stock !== undefined && (
            <div className="mt-2 text-sm text-sky-700">
                {stock > 0 ? (
                    <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            재고 {stock}개 남음
          </span>
                ) : (
                    <span className="text-sky-400">일시 품절</span>
                )}
            </div>
        )}
    </div>
));

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "px-4 pb-4 pt-2 flex items-center justify-between",
            className
        )}
        {...props}
    />
));

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};

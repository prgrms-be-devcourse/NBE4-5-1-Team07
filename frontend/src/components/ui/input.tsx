import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
    label?: string; // 레이블 텍스트
    description?: string; // 설명 텍스트
    error?: string; // 에러 메시지
    icon?: React.ReactNode; // 입력 필드 왼쪽에 표시할 아이콘
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", label, description, error, icon, ...props }, ref) => {
        return (
            <div className="flex flex-col space-y-2">
                {/* 레이블 */}
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {/* 아이콘 */}
                    {icon && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {icon}
                        </div>
                    )}

                    {/* 입력 필드 */}
                    <input
                        type={type}
                        ref={ref}
                        className={cn(
                            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            icon && "pl-10", // 아이콘이 있으면 왼쪽 여백 추가
                            error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300",
                            className
                        )}
                        aria-invalid={!!error} // 에러 상태를 스크린 리더에 전달
                        {...props}
                    />
                </div>

                {/* 설명 텍스트 */}
                {description && !error && (
                    <p className="text-sm text-gray-500">{description}</p>
                )}

                {/* 에러 메시지 */}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
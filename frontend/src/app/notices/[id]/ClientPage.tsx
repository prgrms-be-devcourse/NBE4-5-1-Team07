"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MegaphoneIcon, CalendarIcon, ChevronLeftIcon, TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface NoticeDto {
    id: number;
    title: string;
    content: string;
    createDate: string;
    modifyDate: string;
}

export default function NoticeDetail({ id }: { id: number }) {
    const router = useRouter();
    const [notice, setNotice] = useState<NoticeDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/notices/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error("공지사항 정보를 불러오는 데 실패했습니다.");
                return response.json();
            })
            .then((data) => setNotice(data.data))
            .catch(() => setError("공지사항을 불러오는 중 오류가 발생했습니다."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = () => setShowDeleteModal(true);

    const confirmDelete = () => {
        const authToken = "admin";

        fetch(`http://localhost:8080/api/v1/notices/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ authToken }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("공지사항 삭제에 실패했습니다.");
                alert("공지사항이 삭제되었습니다.");
                router.push("/notices");
            })
            .catch((error) => alert(error.message))
            .finally(() => setShowDeleteModal(false));
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center"
        >
            <div className="bg-red-50 text-red-700 p-6 rounded-xl flex items-center gap-3">
                <ExclamationTriangleIcon className="h-6 w-6" />
                {error}
            </div>
        </motion.div>
    );

    if (!notice) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center"
        >
            <div className="bg-blue-50 text-blue-700 p-6 rounded-xl flex items-center gap-3">
                <MegaphoneIcon className="h-6 w-6" />
                공지사항이 존재하지 않습니다
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white"
        >
            {/* 헤더 섹션 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push("/notices")}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                        <span className="text-lg">목록으로</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 transition-all"
                    >
                        <TrashIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* 컨텐츠 섹션 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    {/* 타이틀 영역 */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8">
                        <div className="flex items-start gap-6">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <MegaphoneIcon className="h-12 w-12 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-white mb-4">
                                    {notice.title}
                                </h1>
                                <div className="flex items-center gap-3 text-blue-100">
                                    <CalendarIcon className="h-6 w-6" />
                                    <span className="text-lg">
                    {new Date(notice.createDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 본문 내용 */}
                    <article className="prose prose-lg max-w-none p-8">
                        <div
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: notice.content }}
                        />
                    </article>
                </motion.div>
            </div>

            {/* 삭제 확인 모달 */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="bg-white p-6 rounded-xl max-w-md w-full"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                                <h3 className="text-xl font-bold">정말 삭제하시겠습니까?</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                이 작업은 되돌릴 수 없으며, 모든 공지 내용이 영구적으로 삭제됩니다.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg"
                                >
                                    삭제하기
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

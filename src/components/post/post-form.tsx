// import { useState } from "react";
// import { ImagePlus, Loader2, Megaphone, X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import defaultAvatar from "@/assets/default-avatar.jpg";
// import { useSession } from "@/store/session";
// import { useUserProfileData } from "@/hooks/queries/use-profile-data";
// import { toast } from "sonner";
// import { compressImageIfNeeded } from "@/lib/image";

// type PostFormProps = {
//   /** 폼 제출 핸들러 */
//   onSubmit: ({
//     content,
//     images,
//     isNotice,
//   }: {
//     content: string;
//     images: File[];
//     isNotice?: boolean;
//   }) => void;

//   /** 취소 핸들러 */
//   onCancel?: () => void;

//   /** 제출 버튼 로딩 상태 */
//   isSubmitting?: boolean;
// };

// export default function PostForm({
//   onSubmit,
//   isSubmitting = false,
// }: PostFormProps) {
//   const session = useSession();

//   const [content, setContent] = useState("");
//   const [images, setImages] = useState<File[]>([]);
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [isNotice, setIsNotice] = useState(false);
//   const [isCompressing, setIsCompressing] = useState(false);

//   const { data: profile } = useUserProfileData(session?.user.id);

//   const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     // 최대 4장 제한 (기존 이미지 개수 고려)
//     const remainingSlots = 4 - images.length;
//     const filesToProcess = files.slice(0, remainingSlots);

//     if (filesToProcess.length === 0) return;

//     try {
//       setIsCompressing(true);

//       // 모든 이미지 압축 처리
//       const compressedFiles = await Promise.all(
//         filesToProcess.map((file) => compressImageIfNeeded(file, "post")),
//       );

//       const newImages = [...images, ...compressedFiles];
//       setImages(newImages);

//       // 미리보기 URL 생성
//       const newPreviewUrls = compressedFiles.map((file) =>
//         URL.createObjectURL(file),
//       );
//       setPreviews([...previews, ...newPreviewUrls]);
//     } catch (error) {
//       toast.error("이미지 처리에 실패했습니다.", { position: "top-center" });
//     } finally {
//       setIsCompressing(false);
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     const newImages = images.filter((_, i) => i !== index);
//     const newPreviews = previews.filter((_, i) => i !== index);

//     // 이전 preview URL 해제
//     URL.revokeObjectURL(previews[index]);

//     setImages(newImages);
//     setPreviews(newPreviews);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!content.trim()) return;

//     onSubmit({ content: content.trim(), images, isNotice });
//   };

//   const isValid = content.trim().length > 0;

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
//       {/* 작성 영역 */}
//       <div className="flex gap-3">
//         <img
//           src={profile?.avatar_url ?? defaultAvatar}
//           alt="내 프로필"
//           className="h-10 w-10 shrink-0 rounded-full border object-cover"
//         />
//         <Textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="가족에게 공유하고 싶은 이야기를 적어보세요"
//           className="focus-visible:border-input min-h-[120px] resize-none focus-visible:ring-0"
//           maxLength={1000}
//         />
//       </div>

//       {/* 이미지 미리보기 */}
//       {previews.length > 0 && (
//         <div className="flex gap-2 overflow-x-auto py-2">
//           {previews.map((preview, index) => (
//             <div key={index} className="relative shrink-0">
//               <img
//                 src={preview}
//                 alt={`첨부 이미지 ${index + 1}`}
//                 className="h-24 w-24 rounded-lg object-cover"
//               />
//               <button
//                 type="button"
//                 onClick={() => handleRemoveImage(index)}
//                 className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full p-1"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 액션 버튼 영역 */}
//       <div className="flex items-center justify-between border-t pt-4">
//         <div className="flex items-center gap-2">
//           {/* 이미지 첨부 버튼 */}
//           <label className="cursor-pointer">
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageSelect}
//               className="hidden"
//               disabled={images.length >= 4 || isCompressing}
//             />
//             <div className="text-muted-foreground hover:bg-muted flex items-center gap-1 rounded-md px-3 py-2 text-sm">
//               {isCompressing ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <>
//                   <ImagePlus className="h-5 w-5" />
//                   <span>{`${images.length}/4`}</span>
//                 </>
//               )}
//             </div>
//           </label>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* 공지 안내 문구 */}
//           {isNotice && (
//             <span className="text-muted-foreground animate-in fade-in slide-in-from-right-2 flex items-center gap-1.5 text-sm">
//               상단에 고정되어 게시돼요
//             </span>
//           )}

//           {/* 공지 버튼 */}
//           <button
//             type="button"
//             onClick={() => setIsNotice(!isNotice)}
//             className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors ${
//               isNotice
//                 ? "bg-primary text-primary-foreground"
//                 : "text-muted-foreground hover:bg-muted"
//             }`}
//           >
//             <Megaphone className="h-5 w-5" />
//           </button>
//           <Button type="submit" disabled={!isValid || isSubmitting}>
//             {isSubmitting ? "게시 중..." : "게시하기"}
//           </Button>
//         </div>
//       </div>
//     </form>
//   );
// }

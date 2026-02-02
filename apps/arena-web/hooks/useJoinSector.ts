import { useMutation } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";
import { useRouter } from "next/navigation";

export default function useJoinSector() {
    const router = useRouter();

    const { mutateAsync: join, isPending: isVerifying, error: mutationError } = useMutation({
        mutationFn: async (accessKey: string) => {
            const response = await api.post("/v1/gateway/join-sector", { accessKey });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.courseId) {
                router.push(`/course/${data.courseId}`);
            }
        },
    });

    const errorMessage =
        Array.isArray((mutationError as any)?.response?.data?.message)
            ? (mutationError as any).response.data.message[0]
            : (mutationError as any)?.response?.data?.message || mutationError?.message;

    return {
        join,
        isVerifying,
        errorMessage
    };
}
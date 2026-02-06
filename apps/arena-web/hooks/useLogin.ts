import { useMutation } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";
import { LoginData } from "@verse/arena-web/types/arena"; // Create this type if not exists
import { useRouter } from "next/navigation";

export default function useLogin() {
    const router = useRouter();

    const { mutateAsync: login, isPending: isLoggingIn, error: mutationError } = useMutation({
        mutationFn: async (data: LoginData) => {
            const response = await api.post("/v1/gateway/login", data);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.access_token) {
                localStorage.setItem("arena_token", data.access_token);
            }
            if (data.user?.role === "admin") {
                router.push("/su");
                return;
            }
            const sectors = data.sectors || [];

            if (sectors.length === 0) {
                router.push("/join-course");
            }
            else if (sectors.length === 1) {
                router.push(`/course/${sectors[0].id}`);
            }
            else {
                router.push("/lobby");
            }
        },
    });

    const errorMessage =
        Array.isArray((mutationError as any)?.response?.data?.message)
            ? (mutationError as any).response.data.message[0]
            : (mutationError as any)?.response?.data?.message || mutationError?.message;

    return {
        login,
        isLoggingIn,
        errorMessage
    };
}
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
            // 1. Store the persistent uplink token
            if (data.access_token) {
                localStorage.setItem("arena_token", data.access_token);
            }

            // 2. Intelligent Redirection Logic
            const sectors = data.sectors || [];

            if (sectors.length === 0) {
                // User has no active sectors, send to join screen
                router.push("/join-course");
            } 
            else if (sectors.length === 1) {
                // Direct deployment to their only active sector
                router.push(`/course/${sectors[0].id}`);
            } 
            else { 
                // Multiple active sectors, send to tactical lobby
                router.push("/lobby"); 
            }
        },
    });

    // Extracting the error message with support for NestJS arrays
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
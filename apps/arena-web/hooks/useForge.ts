import { useMutation } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";
import { RegisterData } from "@verse/arena-web/types/arena";
import { useRouter } from "next/navigation";

export default function useForge() {
    const router = useRouter();

    const { mutateAsync: forge, isPending: isForging, error } = useMutation({
        mutationFn: async (data: RegisterData) => {
            const response = await api.post("/v1/gateway/register", data);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.access_token) {
                localStorage.setItem("arena_token", data.access_token);
            }
            const sectors = data.sectors;
            if (sectors.length == 0) {
                router.push("/join-course");
            }
            else if (sectors.length == 1) {
                router.push(`/course/${sectors[0].id}`);
            }
            else { router.push("/lobby") }
        },
    });
    const errorMessage = (error as any)?.response?.data?.message || error?.message;
    return { forge, isForging, errorMessage };
}
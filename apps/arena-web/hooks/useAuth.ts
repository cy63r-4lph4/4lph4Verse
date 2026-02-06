import { useQuery } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export default function useAuth() {
    const token = typeof window !== "undefined" ? localStorage.getItem("arena_token") : null;
    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ["auth-user"],
        queryFn: async () => {
            if (!token) return null;

            const response = await api.get("/v1/gateway/me");
            return response.data;
        },
        enabled: !!token,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const logout = () => {
        localStorage.removeItem("arena_token");
        window.location.href = "/login";
    };

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        logout,
        refreshUser: refetch
    };
}
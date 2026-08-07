import { useCallback } from 'react';
import { api } from '@verse/arena-web/lib/api';

export interface OpponentSearchMember {
    id: string;
    username: string;
    rank: number;
    winRate: number;
}

export function useAsyncDuel(courseId: string) {
    const searchOpponents = useCallback(async (query: string): Promise<OpponentSearchMember[]> => {
        try {
            const res = await api.get<OpponentSearchMember[]>(
                `/v1/showdown/opponents/search?courseId=${courseId}&q=${encodeURIComponent(query)}`
            );
            return res.data || [];
        } catch (error) {
            console.error('Error searching opponents:', error);
            return [];
        }
    }, [courseId]);

    const createChallenge = useCallback(async (opponentArenaUserId: string, questionsPerMatch = 10, timeLimitSeconds = 20) => {
        const res = await api.post('/v1/showdown/async-duel/challenge', {
            courseId,
            opponentArenaUserId,
            questionsPerMatch,
            timeLimitSeconds,
        });
        return res.data;
    }, [courseId]);

    const getDuelsList = useCallback(async () => {
        try {
            const res = await api.get(`/v1/showdown/async-duel/list?courseId=${courseId}`);
            return Array.isArray(res.data) ? res.data : [];
        } catch (error) {
            console.error('Error listing async duels:', error);
            return [];
        }
    }, [courseId]);

    const getDuelState = useCallback(async (showdownId: string) => {
        try {
            const res = await api.get(`/v1/showdown/async-duel/${showdownId}`);
            return res.data;
        } catch (error) {
            console.error('Error getting duel state:', error);
            return null;
        }
    }, []);

    const submitAnswers = useCallback(async (showdownId: string, answers: { questionNumber: number; optionIndex: number; timeSpentMs: number }[]) => {
        const res = await api.post(`/v1/showdown/async-duel/${showdownId}/answer`, { answers });
        return res.data;
    }, []);

    const acceptChallenge = useCallback(async (showdownId: string) => {
        const res = await api.post(`/v1/showdown/async-duel/${showdownId}/accept`);
        return res.data;
    }, []);

    return {
        searchOpponents,
        createChallenge,
        getDuelsList,
        getDuelState,
        submitAnswers,
        acceptChallenge,
    };
}

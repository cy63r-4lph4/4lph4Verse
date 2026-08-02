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
            const res = await api.get(`/v1/gateway/showdown/opponents/search?courseId=${courseId}&q=${encodeURIComponent(query)}`);
            return res.data || [];
        } catch (error) {
            console.error('Error searching opponents:', error);
            return [];
        }
    }, [courseId]);

    const createChallenge = useCallback(async (opponentArenaUserId: string, questionsPerMatch = 3, timeLimitSeconds = 20) => {
        try {
            const res = await api.post(`/v1/gateway/showdown/async-duel/challenge`, {
                courseId,
                opponentArenaUserId,
                questionsPerMatch,
                timeLimitSeconds,
            });
            return res.data;
        } catch (error) {
            console.error('Error creating async challenge:', error);
            throw error;
        }
    }, [courseId]);

    const getDuelsList = useCallback(async () => {
        try {
            const res = await api.get(`/v1/gateway/showdown/async-duel/list?courseId=${courseId}`);
            return res.data || [];
        } catch (error) {
            console.error('Error listing async duels:', error);
            return [];
        }
    }, [courseId]);

    const getDuelState = useCallback(async (showdownId: string) => {
        try {
            const res = await api.get(`/v1/gateway/showdown/async-duel/${showdownId}`);
            return res.data;
        } catch (error) {
            console.error('Error getting duel state:', error);
            return null;
        }
    }, []);

    const submitAnswers = useCallback(async (showdownId: string, answers: { questionNumber: number; optionIndex: number; timeSpentMs: number }[]) => {
        try {
            const res = await api.post(`/v1/gateway/showdown/async-duel/${showdownId}/answer`, { answers });
            return res.data;
        } catch (error) {
            console.error('Error submitting answers:', error);
            throw error;
        }
    }, []);

    return {
        searchOpponents,
        createChallenge,
        getDuelsList,
        getDuelState,
        submitAnswers,
    };
}

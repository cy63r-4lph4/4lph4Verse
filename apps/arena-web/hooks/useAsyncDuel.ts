import useFetch from '@verse/arena-web/hooks/useFetch';
import { useCallback } from 'react';

export interface OpponentSearchMember {
    id: string;
    username: string;
    rank: number;
    winRate: number;
}

export function useAsyncDuel(courseId: string) {
    const { fetch } = useFetch();

    const searchOpponents = useCallback(async (query: string): Promise<OpponentSearchMember[]> => {
        try {
            const res = await fetch({
                url: `/showdown/opponents/search?courseId=${courseId}&q=${encodeURIComponent(query)}`,
                method: 'GET',
            });
            return res || [];
        } catch (error) {
            console.error('Error searching opponents:', error);
            return [];
        }
    }, [courseId, fetch]);

    const createChallenge = useCallback(async (opponentArenaUserId: string, questionsPerMatch = 3, timeLimitSeconds = 20) => {
        try {
            const res = await fetch({
                url: `/showdown/async-duel/challenge`,
                method: 'POST',
                data: {
                    courseId,
                    opponentArenaUserId,
                    questionsPerMatch,
                    timeLimitSeconds,
                },
            });
            return res;
        } catch (error) {
            console.error('Error creating async challenge:', error);
            throw error;
        }
    }, [courseId, fetch]);

    const getDuelsList = useCallback(async () => {
        try {
            const res = await fetch({
                url: `/showdown/async-duel/list?courseId=${courseId}`,
                method: 'GET',
            });
            return res || [];
        } catch (error) {
            console.error('Error listing async duels:', error);
            return [];
        }
    }, [courseId, fetch]);

    const getDuelState = useCallback(async (showdownId: string) => {
        try {
            const res = await fetch({
                url: `/showdown/async-duel/${showdownId}`,
                method: 'GET',
            });
            return res;
        } catch (error) {
            console.error('Error getting duel state:', error);
            return null;
        }
    }, [fetch]);

    const submitAnswers = useCallback(async (showdownId: string, answers: { questionNumber: number; optionIndex: number; timeSpentMs: number }[]) => {
        try {
            const res = await fetch({
                url: `/showdown/async-duel/${showdownId}/answer`,
                method: 'POST',
                data: { answers },
            });
            return res;
        } catch (error) {
            console.error('Error submitting answers:', error);
            throw error;
        }
    }, [fetch]);

    return {
        searchOpponents,
        createChallenge,
        getDuelsList,
        getDuelState,
        submitAnswers,
    };
}


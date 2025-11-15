export const mockEnrollments = [
    {
        id: 1,
        userId: 2,
        courseId: 1,
        enrolledAt: '2024-11-01T10:00:00.000Z',
        attempts: [
            {
                id: 1001,
                startedAt: '2024-11-01T11:00:00.000Z',
                submittedAt: '2024-11-01T11:45:00.000Z',
                status: 'completed',
                score: 8,
                totalMarks: 10,
                percentage: 80,
                totalQuestions: 10,
                answeredQuestions: 10,
                answers: {},
                violationCount: 2,
                autoSubmitted: false,
                violations: [
                    {
                        type: 'tab_switch',
                        description: 'Switched to another tab or window',
                        timestamp: '2024-11-01T11:15:00.000Z',
                    },
                    {
                        type: 'fullscreen_exit',
                        description: 'Exited fullscreen mode',
                        timestamp: '2024-11-01T11:20:00.000Z',
                    },
                ],
            },
        ],
    },
    
    {
        id: 2,
        userId: 2,
        courseId: 2,
        enrolledAt: '2024-11-10T09:00:00.000Z',
        attempts: [
            {
                id: 2001,
                startedAt: '2024-11-10T10:00:00.000Z',
                submittedAt: '2024-11-10T10:45:00.000Z',
                status: 'completed',
                score: 7,
                totalMarks: 10,
                percentage: 70,
                totalQuestions: 10,
                answeredQuestions: 9,
                answers: {},
            },
        ],
    },

    {
        id: 3,
        userId: 3,
        courseId: 1,
        enrolledAt: '2024-11-08T12:00:00.000Z',
        attempts: [
            {
                id: 3001,
                startedAt: '2024-11-08T13:00:00.000Z',
                submittedAt: '2024-11-08T13:40:00.000Z',
                status: 'completed',
                score: 6,
                totalMarks: 10,
                percentage: 60,
                totalQuestions: 10,
                answeredQuestions: 10,
                answers: {},
            },
        ],
    },
];

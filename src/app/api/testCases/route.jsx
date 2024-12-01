import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_2 } from '../../../../prisma/client';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const AppID = searchParams.get('appId');
        const testType = searchParams.get('testType');
        const isolationLevel = searchParams.get('isolationLevel');
        const validIsolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
        
        if (!AppID) {
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }
        const selectedIsolationLevel = validIsolationLevels.includes(isolationLevel) ? isolationLevel : undefined;

        const filters = { AppID: { contains: AppID } };

        if (testType === "Read") {
            const startTime = Date.now();
            const [mainGames, node2Games] = await Promise.all([
                main_node.$transaction(
                    async (transaction) => {
                        return transaction.games.findFirst({ where: filters });
                    },
                    { isolationLevel: selectedIsolationLevel }
                ),
                node_2.$transaction(
                    async (transaction) => {
                        return transaction.games.findFirst({ where: filters });
                    },
                    { isolationLevel: selectedIsolationLevel }
                )
            ]);
            const endTime = Date.now();
            const duration = endTime - startTime;     
            const totalGames = {
                main_node: { games: mainGames },
                node_2: { games: node2Games },
            };

            return NextResponse.json({
                totalGames,
                transactionTime: `${duration} ms`,
                isolationLevel
            });
        }
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}
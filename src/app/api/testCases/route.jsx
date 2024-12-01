import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_1, node_2 } from '../../../../prisma/client';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const AppID = searchParams.get('appId');
        const testType = searchParams.get('testType');
        const validIsolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
        const isolationLevel = validIsolationLevels[0]
        
        if (!AppID) {
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }

        const filters = { AppID: { contains: AppID } };

        const readAll = async (transaction) => {
            const [mainGames, node2Games] = await Promise.all([
                transaction.main_node ? transaction.main_node.games.findFirst({ where: filters }) : main_node.games.findFirst({ where: filters }),
                node_2.games.findFirst({
                    where: filters,
                }),
            ]);
            const totalGames = {
                main_node: { games: mainGames },
                node_2: { games: node2Games },
            };
            return totalGames;
        }

        if (testType === "Read") {
            const response = await main_node.$transaction(
                async (transaction) => {
                    return await readAll(transaction);
                },
                { isolationLevel } 
            );
            return NextResponse.json(response);
        }
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_1, node_2 } from '../../../../prisma/client';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const AppID = searchParams.get('appId');

        if (!AppID) {
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }

        const filters = { AppID: { contains: AppID } };

        const allNode2Games = await node_2.games.findMany({});
        console.log('All games on node_2:', allNode2Games);

        const [mainCount, mainGames, node2Count, node2Games] = await Promise.all([
            main_node.games.count({ where: filters }),
            main_node.games.findMany({
                where: filters,
            }),
          //  node_1.games.count({ where: filters }),
          //  node_1.games.findMany({
          //      where: filters,
           // }),
            node_2.games.count({ where: filters }),
            node_2.games.findMany({
                where: filters,
            }),
        ]);

        console.log('Filtered results for main node:', mainGames);
     //   console.log('Filtered results for node 1:', node1Games);
        console.log('Filtered results for node 2:', node2Games);

        if (allNode2Games.length === 0) {
            console.error('No data found in node_2 database. Check connection or data presence.');
        }

        const totalGames = {
            main_node: { count: mainCount, games: mainGames },
         //   node_1: { count: node1Count, games: node1Games },
            node_2: { count: node2Count, games: node2Games },
        };

        return NextResponse.json(totalGames);
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}
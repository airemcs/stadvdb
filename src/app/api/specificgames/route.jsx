
import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_2, node_1 } from '../../../../prisma/client';


export async function GET(request) {
    try {
        
        const { searchParams } = new URL(request.url);
        const AppID = searchParams.get('appId');
        const node = searchParams.get('node');
    
        let currentNode = main_node; 
        if (node === "main_node") {
            currentNode = main_node;
        } else if (node === "Node1") {
            currentNode = node_1;
        } else if (node === "Node2") {
            currentNode = node_2;
        }

        const games = await currentNode.games.findFirst({
            where: {AppID : AppID},
        });

        if (games.length === 0) {
            return NextResponse.json({ message: 'No games found' }, { status: 404 });
        }
        return NextResponse.json({ games: games });
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}

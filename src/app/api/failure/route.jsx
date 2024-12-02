import { NextResponse } from 'next/server';
import { main_node, node_1, node_2 } from '../../../../prisma/client';

export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const appID = searchParams.get('appID');
    const node = searchParams.get('node');

    if (!appID) {
      return NextResponse.json({ message: 'appID is required' }, { status: 400 });
    }

    const nodesMap = { main_node, node_1, node_2 };
    const selectedNode = nodesMap[node];

    if (!selectedNode) {
      return NextResponse.json({ message: 'Invalid node specified' }, { status: 400 });
    }

    console.log(`Fetching from node: ${node}, appID: ${appID}`);

    const game = await selectedNode.games.findFirst({ where: { AppID: appID } });

    if (!game) {
      console.log("No Game");
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ game });

  } catch (error) {
    console.error('Error fetching game details:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to fetch game details' }, { status: 500 });
  }
}

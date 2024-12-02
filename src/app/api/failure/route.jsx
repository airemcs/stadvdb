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

export async function PUT(request) {
    try {
      const body = await request.json();
      const { AppID, Name, Price } = body;
  
      if (!AppID) {
        return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
      }
  
      const { searchParams } = new URL(request.url);
      const node = searchParams.get('node');
      const nodesMap = { main_node, node_1, node_2 };
      const selectedNode = nodesMap[node];
  
      if (!selectedNode) {
        return NextResponse.json({ message: 'Invalid node specified' }, { status: 400 });
      }
  
      console.log(`Updating game in node: ${node}, AppID: ${AppID}`);
  
      // Check if the game exists in the selected node
      const game = await selectedNode.games.findFirst({ where: { AppID } });
      if (!game) {
        return NextResponse.json({ message: 'Game not found in selected node' }, { status: 404 });
      }
  
      // Update the specified node
      const updatedData = {
        ...(Name && { Name }),
        ...(Price && { Price }),
      };
  
      const updatedGame = await selectedNode.games.update({
        where: { AppID },
        data: updatedData,
      });
  
      console.log(`Updated game in ${node}:`, updatedGame);
  
      // Synchronize changes across all nodes
      await synchronizeAcrossNodes(AppID, updatedData);
  
      return NextResponse.json({ game: updatedGame });
  
    } catch (error) {
      console.error('Error updating game details:', error.message, error.stack);
      return NextResponse.json({ error: 'Failed to update game details' }, { status: 500 });
    }
  }
  
  async function synchronizeAcrossNodes(AppID, data) {
    const nodes = [main_node, node_1, node_2];
    
    for (const node of nodes) {
      const game = await node.games.findFirst({ where: { AppID } });
      
      if (game) {
        await node.games.update({
          where: { AppID },
          data,
        });
        console.log(`Synchronized game in ${node.name}:`, game);
      } else {
        console.warn(`Game not found in ${node.name}. Skipping update.`);
      }
    }
  }
  
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

  export async function DELETE(request) {
    try {
      const { searchParams } = new URL(request.url);
      const appID = searchParams.get('id');
      const node = searchParams.get('node');
      const nodeStatuses = searchParams.get('nodeStatuses');
  
      if (!appID) {
        return NextResponse.json({ message: 'appID is required' }, { status: 400 });
      }
  
      const nodesMap = { main_node, node_1, node_2 };
      const selectedNode = nodesMap[node];
  
      if (!selectedNode) {
        return NextResponse.json({ message: 'Invalid node specified' }, { status: 400 });
      }
  
      console.log(`Deleting game from node: ${node}, appID: ${appID}`);
  
      // Check if the game exists in the selected node
      const game = await selectedNode.games.findFirst({ where: { AppID: appID } });
      if (!game) {
        return NextResponse.json({ message: 'Game not found' }, { status: 404 });
      }
  
      // Delete the game from the selected node
      await selectedNode.games.delete({
        where: { AppID: appID },
      });
  
      console.log(`Deleted game from ${node}:`, game);
  
      // Synchronize the deletion across all nodes
      await synchronizeDeletionAcrossNodes(appID);
  
      return NextResponse.json({ message: 'Game deleted successfully' });
  
    } catch (error) {
      console.error('Error deleting game details:', error.message, error.stack);
      return NextResponse.json({ error: 'Failed to delete game details' }, { status: 500 });
    }
  }
  
  // Renamed function to avoid conflict
  async function synchronizeDeletionAcrossNodes(AppID) {
    const nodes = [main_node, node_1, node_2];
    
    for (const node of nodes) {
      const game = await node.games.findFirst({ where: { AppID } });
  
      if (game) {
        await node.games.delete({
          where: { AppID },
        });
        console.log(`Synchronized deletion in ${node.name}`);
      } else {
        console.warn(`Game not found in ${node.name}. Skipping deletion.`);
      }
    }
  }

  export async function POST(request) {
    try {
      const body = await request.json();
      const { AppID, Name, Price } = body;
  
      if (!AppID || !Name || !Price) {
        return NextResponse.json({ message: 'AppID, Name, and Price are required' }, { status: 400 });
      }
  
      const { searchParams } = new URL(request.url);
      const node = searchParams.get('node');
      const nodesMap = { main_node, node_1, node_2 };
      const selectedNode = nodesMap[node];
  
      if (!selectedNode) {
        return NextResponse.json({ message: 'Invalid node specified' }, { status: 400 });
      }
  
      console.log(`Creating game in node: ${node}, AppID: ${AppID}`);
  
      // Check if the game already exists in the selected node
      const existingGame = await selectedNode.games.findFirst({ where: { AppID } });
      if (existingGame) {
        return NextResponse.json({ message: 'Game with the same AppID already exists' }, { status: 409 });
      }
  
      // Create the new game in the selected node
      const newGame = await selectedNode.games.create({
        data: {
          AppID,
          Name,
          Price,
        },
      });
  
      console.log(`Created game in ${node}:`, newGame);
  
      // Synchronize creation across all nodes
      await synchronizeCreationAcrossNodes(newGame);
  
      return NextResponse.json({ game: newGame }, { status: 201 });
  
    } catch (error) {
      console.error('Error creating game:', error.message, error.stack);
      return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
    }
  }
  
  async function synchronizeCreationAcrossNodes(game) {
    const nodes = [main_node, node_1, node_2];
    
    for (const node of nodes) {
      const existingGame = await node.games.findFirst({ where: { AppID: game.AppID } });
  
      if (!existingGame) {
        await node.games.create({
          data: game,
        });
        console.log(`Synchronized creation in ${node.name}:`, game);
      } else {
        console.warn(`Game already exists in ${node.name}. Skipping creation.`);
      }
    }
  }
  
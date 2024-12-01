
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

export async function PUT(request) {
    try {
      // Parse the request body
      const body = await request.json();
      const {
        id,
        name,
        releaseDate,
        price,
      } = body
  
      for (const [key, value] of Object.entries(body)) {
        console.log(`Key: ${key}, Value: ${value}`);
      }

      let currentNode = node; 

        if (node === "main_node") {
            currentNode = main_node;
        } else if (node === "Node1") {
            currentNode = node_1;
        } else if (node === "Node2") {
            currentNode = node_2;
        }
      
        let updatedGame1;
        let updatedGame2;
  
      // Update the game record in the database
      let date = releaseDate.split('-')
      
      console.log("updating main node");
      console.log(node);

      const updatedGame = await main_node.games.update({
        where: { AppID: id }, // Ensure `id` exists and is passed correctly
        data: {
            AppID: id,
            Name: name,
            Price: price
        },
      });

      if (Number(date[0])< 2010){
        console.log("updating node 1");
        updatedGame1 = await node_1.games.update({
          where: { AppID: id }, // Ensure `id` exists and is passed correctly
          data: {
            AppID: id,
            Name: name,
            Price: price
          },
        });

      }else if(Number(date[0]) >= 2010){
        console.log("updating node 2");

        updatedGame2 = await node_2.games.update({
          where: { AppID: id }, // Ensure `id` exists and is passed correctly
          data: {
            AppID: id,
            Name: name,
            Price: price
          },
        });
      }
  
      // Return the updated game as a JSON response
      return NextResponse.json(updatedGame,updatedGame1,updatedGame2);
  
    } catch (error) {
      console.error('Error updating game:', error);
  
      // Handle errors gracefully
      return NextResponse.json(
        { error: 'Failed to update game' },
        { status: 500 }
      );
    }
  }
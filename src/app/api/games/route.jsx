import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_1, node_2 } from '../../../../prisma/client';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const AppID = searchParams.get('appId');
        const gameName = searchParams.get('gameName');
        const date = searchParams.get('year');
        const node = searchParams.get('node');
        const price = searchParams.get('price');
        const requiredAge = searchParams.get('requiredAge');
        const estimatedOwners = searchParams.get('estimatedOwners');
        const filters = {};
        let currentNode = main_node; 
        if (node === "main_node") {
            currentNode = main_node;
        } else if (node === "Node1") {
            currentNode = node_1;
        } else if (node === "Node2") {
            currentNode = node_2;
        }
        if (AppID) filters.AppID = { contains: AppID };
        if (gameName) filters.Name = { contains: gameName };
        if (date) {
            const startOfYear = new Date(`${date}-01-01`).toISOString();
            const endOfYear = new Date(`${date}-12-31T23:59:59`).toISOString();
            filters.ReleaseDate = { gte: startOfYear, lt: endOfYear };
        }
        if (price) filters.Price = parseFloat(price);
        if (requiredAge) filters.RequiredAge = parseInt(requiredAge, 10);
        if (estimatedOwners) filters.EstimatedOwners = { contains: estimatedOwners };

        const count = await currentNode.games.count({ where: filters });
        const page = parseInt(searchParams.get('page'), 10) || 1;
        const limit = parseInt(searchParams.get('limit'), 10) || 50;
        const skip = (page - 1) * limit;

        const games = await currentNode.games.findMany({
            where: filters,
            skip: skip,
            take: limit,
        });

        if (games.length === 0) {
            return NextResponse.json({ message: 'No games found' }, { status: 404 });
        }
        return NextResponse.json({ count: count, games: games });
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
        estimatedOwners,
        peakCCU,
        requiredAge,
        price,
        dlcCount,
        website,
        supportEmail,
        recommends,
        averagePlaytime,
        medianPlaytime,
        publishers,
        categories,
        genres,
        tags,
      } = body
  
      for (const [key, value] of Object.entries(body)) {
        console.log(`Key: ${key}, Value: ${value}`);
      }
  
      // Update the game record in the database
      const updatedGame = await prisma.games.update({
        where: {   AppID: id }, // Ensure `id` exists and is passed correctly
        data: {
          AppID: id,
          Name: name,
          ReleaseDate: releaseDate,
          EstimatedOwners: estimatedOwners,
          PeakCCU: peakCCU,
          RequiredAge: requiredAge,
          Price: price,
          DLCCOUNT: dlcCount,
          Website: website,
          SupportEmail: supportEmail,
          Recommends: recommends,
          AveragePlaytime: averagePlaytime,
          MedianPlaytime: medianPlaytime,
          Publishers: publishers,
          Categories: categories,
          Genres: genres,
          Tags: tags,
        },
      });
  
      // Return the updated game as a JSON response
      return NextResponse.json(updatedGame);
  
    } catch (error) {
      console.error('Error updating game:', error);
  
      // Handle errors gracefully
      return NextResponse.json(
        { error: 'Failed to update game' },
        { status: 500 }
      );
    }
  }
  
  
  export async function DELETE() {
    const { id } = await request.json();
  
    try {
      await prisma.games.delete({
        where: { id }
      });
      
      return NextResponse.json({ message: 'Game deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
    }
  }
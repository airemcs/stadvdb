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
        node
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

      if (Number(date[0])< 2010){
        console.log("updating node 1");
        updatedGame1 = await node_1.games.update({
          where: { AppID: id }, // Ensure `id` exists and is passed correctly
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

      }else if(Number(date[0]) >= 2010){
        console.log("updating node 2");

        updatedGame2 = await node_2.games.update({
          where: { AppID: id }, // Ensure `id` exists and is passed correctly
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
  
export async function DELETE(request) {

  const body = await request.json();

  let currentNode = body.node; 

  const year = body.id.releasedDate.split('-');
  console.log(parseInt(year[0]));

  console.log(body.id.id);

  console.log(body.node === "Node2");

  let deletegame1;
  let deletegame2;

  if (body.node === "main_node") {
      currentNode = main_node;
  } else if (body.node === "Node1") {
      currentNode = node_1;
  } else if (body.node === "Node2") {
      currentNode = node_2;
  }

  try {
    
    console.log("deleting in main");
    const deletegame = await main_node.games.delete({
      where: { AppID: body.id.id }
    });

    if (body.node === "Node1" ||  parseInt(year[0]) < 2010){
      console.log("deleting in node 1");
      deletegame1 = await node_1.games.delete({
        where: { AppID: body.id.id }
      });
    }

    if (body.node === "Node2" || parseInt(year[0]) >= 2010){
      console.log("deleting in node 2");
      deletegame2 = await node_2.games.delete({
        where: { AppID: body.id.id }
      });
    }

    return NextResponse.json(deletegame,deletegame1,deletegame2);

  } catch (error) {
    console.error('Error deleting game:', error);
    console.error('Error deleting games:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}
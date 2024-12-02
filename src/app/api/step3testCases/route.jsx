import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_2, node_1 } from '../../../../prisma/client';


export async function DELETE(request) {
    try {
        let status = []
        const { searchParams } = new URL(request.url);

        const AppID = searchParams.get('appId');
        const testType = searchParams.get('testType');
        const isolationLevel = searchParams.get('isolationLevel');
        const node = searchParams.get('node');
        const releasedYear = searchParams.get('releasedYear');
        let game = {};
        
        if (!AppID) {
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }

       
        const startTime = Date.now();

        let node1Games;
        let node2Games
    
        // if main node is unavailable
        if(node == 'main_node'){
            try{
                const mainGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            await main_node.$disconnect(); 
                            return transaction.games.delete({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )
                status.push('Main_node is available!');
                game = mainGames;
            }catch(error){
                status.push('Main_node is unavailable, attempting to save transaction to node_1....');
                
                // insert to tempGames table the transaction (delete, appId, add the update)

                if (node1Games != null) // meaning it is in node2
                {
                    status.push('Save transaction to node_1!');
                    game = node1Games
                }
                else{
                    status.push('Cannot save in node_1, attempting to read from node_2...');
                    node2Games = await (
                        node_2.$transaction(
                            async (transaction) => {
                                return transaction.games.findFirst({ where: {AppID: AppID} });
                            },
                            { isolationLevel: "ReadCommitted" }
                        )
                    )
                    if (node2Games == null) // meaning it is in node2
                    {
                        status.push('Error...');
                    }
                    else{
                        status.push('Save transaction to node_1!');
                        game = node2Games
                    }
                }

                game = node2Games;
                await main_node.$connect(); 
                status.push('Main_node is now online!');
                status.push('Will be redoing saved transactions to main_node');
            }
            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                isolationLevel,
                status: status
            });
        }else if(node == 'node_1'){
            try{
                node1Games = await (
                    node_1.$transaction(
                        async (transaction) => {
                            await node_1.$disconnect(); 
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )

                status.push('Node_1 is available!');
                game = node1Games;

            }catch(error){
                status.push('Node_1 is unavailable, attempting to read from main_node...');
            
                const mainGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                    
                )
                status.push('Read in main_node!');
                game = mainGames;

                await node_1.$connect();  
                status.push('Node_1 is now online!');
            }
            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                isolationLevel,
                status: status
            });
        }else if(node == 'node_2'){
            try{
                node2Games = await (
                    node_2.$transaction(
                        async (transaction) => {
                            await node_2.$disconnect(); 
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )

                status.push('Node_2 is available!');
                game = node1Games;

            }catch(error){
                status.push('Node_2 is unavailable, attempting to read from main_node...');
            
                const mainGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                    
                )
                status.push('Read in main_node!');
                game = mainGames;

                await node_2.$connect();  
                status.push('Node_2 is now online!');
            }
            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                isolationLevel,
                status: status
            });
        }
            
        
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}

export async function GET(request) {

    let nodeRead;
    try {
        let status = []
        const { searchParams } = new URL(request.url);
        console.log(request.url);
        console.log("going GET");
        console.log(searchParams);

        const AppID = searchParams.get('appId');
        const testType = searchParams.get('testType');
        const isolationLevel = searchParams.get('isolationLevel');
        const node = searchParams.get('node');
        const releasedYear = searchParams.get('releasedYear');
        console.log("this part run");
        console.log(releasedYear);

        console.log("i got the year in route" + Number(releasedYear));
        let game = {};
        
        if (!AppID) {
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }

        
        const startTime = Date.now();

        let node1Games;
        let node2Games

        // if main node is unavailable
        if(node == 'main_node'){
            try{
                const mainGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            await main_node.$disconnect(); 
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )
                status.push('Main_node is available!');
                game = mainGames;
            }catch(error){
                status.push('Main_node is unavailable, attempting to read from node_1...');
                
                node1Games = await (
                    node_1.$transaction(
                        async (transaction) => {
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )

                if (node1Games != null) // meaning it is in node2
                {
                    status.push('Read from the node_1!');
                    console.log(node1Games)
                    game = node1Games
                    nodeRead = "node_1"
                }
                else{
                    status.push('Main_node is unavailable, attempting to read from node_2...');
                    node2Games = await (
                        node_2.$transaction(
                            async (transaction) => {
                                return transaction.games.findFirst({ where: {AppID: AppID} });
                            },
                            { isolationLevel: "ReadCommitted" }
                        )
                    )
                    if (node2Games == null) // meaning it is in node2
                    {
                        status.push('Error...');
                    }
                    else{
                        status.push('Read from the node_2!');
                        game = node2Games
                        nodeRead = 'node_2'
                    }
                }

                await main_node.$connect(); 
                
                status.push('Main_node is now online!');
            }
            const endTime = Date.now();
            const duration = endTime - startTime;    
            console.log("marker") 
            console.log(game)
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                isolationLevel,
                status: status,
                nodeRead: nodeRead
            });
        }else if(node == 'node_1'){
            try{
                node1Games = await (
                    node_1.$transaction(
                        async (transaction) => {
                            await node_1.$disconnect(); 
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )

                status.push('Node_1 is available!');
                game = node1Games;

            }catch(error){
                status.push('Node_1 is unavailable, attempting to read from main_node...');
            
                const mainGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                    
                )
                status.push('Read in main_node!');
                nodeRead = "main_node"
                game = mainGames;

                await node_1.$connect();  
                status.push('Node_1 is now online!');
            }

            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            console.log("marker");
            console.log(game);
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                isolationLevel,
                status: status,
                nodeRead:nodeRead
            });
        }else if(node == 'node_2'){
            try{
                node2Games = await (
                    node_2.$transaction(
                        async (transaction) => {
                            await node_2.$disconnect(); 
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )

                status.push('Node_2 is available!');
                game = node1Games;

            }catch(error){
                status.push('Node_2 is unavailable, attempting to read from main_node...');
            
                const mainGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                    
                )
                status.push('Read in main_node!');
                game = mainGames;
                nodeRead = 'main_node'

                await node_2.$connect();  
                status.push('Node_2 is now online!');
            }
            const endTime = Date.now();
            const duration = endTime - startTime;     

            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                isolationLevel,
                status: status,
                nodeRead:nodeRead
            });

        }
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}

export async function PUT(request) {
    
    try {
        let status = []
        const body = await request.json();
        const {
          id,
          name,
          releasedYear,
          price,
          node
        } = body

        let savedNode;

        console.log(body);

        console.log("i got the year in route" + Number(releasedYear));
        let game = {};
        
        if (!id) {
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }
        
        const startTime = Date.now();
        let node2Games;
        let node1Games;
        let mainnodeGames;

        // if main node is unavailable
        if(node == 'main_node'){
            try{
                mainnodeGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            await main_node.$disconnect(); 
                            return transaction.games.update({
                                where: { AppID: id }, 
                                data: {
                                    Name: name,
                                    Price: price
                                },
                              });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )
                status.push('Main_node is available!');
                await main_node.$connect(); 

            }catch(error){
                status.push('Main_node is unavailable, attempting to save updates with node_1...');

                const gameNode1 = await node_1.games.findFirst({
                    where: {AppID : id},
                });

                if (gameNode1 != null) // meaning it is in node1
                {
                    node1Games = await (
                        node_1.$transaction(
                            async (transaction) => {
                                return transaction.tempGames.create({
                                    data: {
                                        AppID: id,
                                        Name: name,
                                        Price: price,
                                        ReleaseDate:"",
                                        EstimatedOwners:"",
                                        PeakCCU:0,                             
                                        RequiredAge :0,                  
                                        Price:0.0,                         
                                        DLCCOUNT:0,
                                        Website:"",
                                        SupportEmail:"",
                                        Publishers:"",
                                        AveragePlaytime:0,                 
                                        MedianPlaytime :0, 
                                        Categories:"",
                                        Genres:"",
                                        Tags:"",
                                        Transact:"update"
                                    },
                                  });
                            }
                        )
                    )
                    status.push('Transaction saved in node_1!');
                    savedNode = "node_1"
                }else{
                    status.push('Cannot save transaction in node_1, attempting to save transaction in node_2...');

                    const gameNode2 = await node_2.games.findFirst({
                        where: {AppID : id}
                    });

                    if (gameNode2 != null) // meaning it is in node 2
                    {
                        node2Games = await (
                            node_2.$transaction(
                                async (transaction) => {
                                    return transaction.tempGames.create({
                                        data: {
                                            AppID: id,
                                            Name: name,
                                            Price: price,
                                            ReleaseDate:"",
                                            EstimatedOwners:"",
                                            PeakCCU:0,                             
                                            RequiredAge :0,                  
                                            Price:0.0,                         
                                            DLCCOUNT:0,
                                            Website:"",
                                            SupportEmail:"",
                                            Publishers:"",
                                            AveragePlaytime:0,                 
                                            MedianPlaytime :0, 
                                            Categories:"",
                                            Genres:"",
                                            Tags:"",
                                            Transact:"update"
                                        },
                                      });
                                }
                            )
                        )
                        status.push('Transaction saved in node_2!');
                        savedNode = "node_2"
                    }else{
                        status.push('Error...');
                    }
                }

                game = node2Games;
                await main_node.$connect(); 
                status.push('Main_node is now online!');
                status.push('Checking records for saved transactions');

                if (savedNode == 'node_1'){
                    const savedTransactions = await node_1.tempGames.findMany();
                }else if (savedNode == 'node_2'){
                    const savedTransactions = await node_2.tempGames.findMany();
                }

                let transaction = []

                console.log(savedTransactions);
                
                savedTransactions.map(async(transaction, index)=>{
                    transaction[index] = await (
                        main_node.$transaction(
                            async (transaction) => {
                                return transaction.games.update({
                                    where: { AppID: transaction.AppID }, 
                                    data: {
                                        Name: transaction.Name,
                                        Price: transaction.Price
                                    },
                                  });
                            }
                        )
                    )
                })

                status.push('Updating records in main_node...');
                status.push('Update Success!');

            }
            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                isolationLevel,
                status: status
            });
        }else if(node == 'node_1'){
            try{
                node1Games = await (
                    main_node.$transaction(
                        async (transaction) => {
                            await node_1.$disconnect(); 
                            return transaction.games.update({
                                where: { AppID: id }, 
                                data: {
                                    Name: name,
                                    Price: price
                                },
                              });
                        }
                    )
                )
                status.push('node_1 is available!');
                await main_node.$connect(); 

            }catch(error){
                status.push('Node_1 is unavailable, attempting to save updates with main_node...');

                mainnodeGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.temp.create({
                                data: {
                                    AppID: id,
                                    Name: name,
                                    Price: parseFloat(price),
                                    ReleaseDate:"",
                                    EstimatedOwners:"",
                                    PeakCCU:0,                             
                                    RequiredAge :0,                  
                                    Price:0.0,                         
                                    DLCCOUNT:0,
                                    Website:"",
                                    SupportEmail:"",
                                    Publishers:"",
                                    AveragePlaytime:0,                 
                                    MedianPlaytime :0, 
                                    Categories:"",
                                    Genres:"",
                                    Tags:"",
                                    Transact:"update"
                                },
                                });
                        }
                    )
                )

                status.push('Transaction saved in main_node!');

                await node_1.$connect(); 

                status.push('Node_1 is now online!');
                status.push('Checking records for saved transactions...');

                const savedTransactions = await main_node.temp.findMany();

                let transaction = []

                console.log(savedTransactions);
                
                try{
                    savedTransactions.map(async (transaction, index)=>{
                    console.log(transaction);
                    transaction[index] = await (
                        node_1.$transaction(
                            async (transaction) => {
                                return transaction.games.update({
                                    where: { AppID: transaction.AppID }, 
                                    data: {
                                        Name: transaction.Name,
                                        Price: transaction.Price
                                    },
                                  });
                            }
                        )
                    )
                })

                }catch(error){
                    console.log(error);
                }
                

                status.push('Updating records in main_node...');
                status.push('Update Success!');
            }
            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                status: status
            });
        }   
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}
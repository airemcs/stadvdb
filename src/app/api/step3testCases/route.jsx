import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_2, node_1 } from '../../../../prisma/client';

export async function DELETE(request) {
    try {
        let status = []
        const body = await request.json();
        const {
          id,
          name,
          price,
          node,
          releasedYear
        } = body

        let savedNode;

        console.log("marker");
        const newPrice = parseFloat(price)
        console.log(releasedYear);
        
        console.log(body);
        
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
                mainGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            await main_node.$disconnect(); 
                            return transaction.games.delete({
                                where: { AppID: id }});
                        }
                    )
                )

            }catch(error){
                if (releasedYear < 2010){
                    status.push("Error Message: " + error);
                    status.push('Main_node is unavailable, attempting to save delete with node_1...');
                    
                    node1Games = await (
                        node_1.$transaction(
                            async (transaction) => {
                                return transaction.temp.create({
                                    data: {
                                        AppID: id,
                                        Name: name,
                                        Price: newPrice,
                                        ReleaseDate:"",
                                        EstimatedOwners:"",
                                        PeakCCU:0,                             
                                        RequiredAge :0,                                       
                                        DLCCOUNT:0,
                                        Website:"",
                                        SupportEmail:"",
                                        Publishers:"",
                                        AveragePlaytime:0,                 
                                        MedianPlaytime :0, 
                                        Categories:"",
                                        Genres:"",
                                        Tags:"",
                                        Transact:"delete",
                                        Node:"node_1"
                                    },
                                    });
                            }
                        )
                    )
    
                    status.push('Transaction saved in node_1!');
                    status.push('Main_node is now online!');
                    status.push('Checking records for saved transactions...');
    
                    // only get the transaction with transact as update
                    // put node_1 as the node
                    const savedTransactions = await node_1.temp.findMany();
    
                    let transaction;
                    let propagatetransaction;
                    let deletetransaction;
                    
                    try{
                        await main_node.$connect(); 
    
                        transaction = await (
                            main_node.$transaction(
                                async (transaction) => {
                                    return transaction.games.delete({
                                        where: { AppID: savedTransactions[0].AppID }
                                        });
                                }
                            )
                        )

                        status.push('Deleting record in main_node...');

                        propagatetransaction = await (
                            node_1.$transaction(
                                async (transaction) => {
                                    return transaction.games.delete({
                                        where: { AppID: savedTransactions[0].AppID }
                                        });
                                }
                            )
                        )

                        status.push('Deleting record in node_1...');
                        status.push('Delete Success!');

                        // delete the transaction records in temp node_1
                        status.push('Deleting delete transaction record of saved transactions...');
                        deletetransaction = await (
                            node_1.$transaction(
                                async (transaction) => {
                                    return transaction.temp.delete({where: {AppID: savedTransactions[0].AppID}})
                                }
                            )
                        )
                    
                    }catch(error){
                        console.log(error);
                    }
                    
                }else if (releasedYear >= 2010){
                    status.push("Error Message: " + error)
                    status.push('Main_node is unavailable, attempting to save deletes with node_2...');
                    
                    node2Games = await (
                        node_2.$transaction(
                            async (transaction) => {
                                return transaction.temp.create({
                                    data: {
                                        AppID: id,
                                        Name: name,
                                        Price: newPrice,
                                        ReleaseDate:"",
                                        EstimatedOwners:"",
                                        PeakCCU:0,                             
                                        RequiredAge :0,                                       
                                        DLCCOUNT:0,
                                        Website:"",
                                        SupportEmail:"",
                                        Publishers:"",
                                        AveragePlaytime:0,                 
                                        MedianPlaytime :0, 
                                        Categories:"",
                                        Genres:"",
                                        Tags:"",
                                        Transact:"delete",
                                        Node:"node_2"
                                    },
                                    });
                            }
                        )
                    )
    
                    status.push('Transaction saved in node_2!');
                    status.push('Main_node is now online!');
                    status.push('Checking records for saved transactions...');
    
                    // only get the transaction with transact as update
                    // put node_2 as the node
                    const savedTransactions = await node_2.temp.findMany();
    
                    let transaction;
                    let propagatetransaction;
                    let deletetransaction;
                    
                    try{
                        savedTransactions.map(async (transact, index)=>{

                        await main_node.$connect(); 

                        transaction = await (
                            main_node.$transaction(
                                async (transaction) => {
                                    return transaction.games.delete({
                                        where: { AppID: savedTransactions[0].AppID }
                                    });
                                }
                            )
                        )

                        status.push('Deleting record in main_node...');

                        propagatetransaction = await (
                            node_2.$transaction(
                                async (transaction) => {
                                    return transaction.games.delete({
                                        where: { AppID: savedTransactions[0].AppID }
                                        });
                                }
                            )
                        )

                        status.push('Deleting record in node_2...');
                        status.push('Delete Success!');

                        // delete the transaction records in temp node_1
                        status.push('Deleting delete transaction record of saved transactions...');
                        deletetransaction = await (
                            node_2.$transaction(
                                async (transaction) => {
                                    return transaction.temp.delete({where: {AppID: savedTransactions[0].AppID}})
                                }
                            )
                        )
                    })
                    }catch(error){
                        console.log(error);
                    }
                }
            }
            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                status: status
            });
        }else if(node == 'node_1'){
            try{
                node1Games = await (
                    node_1.$transaction(
                        async (transaction) => {
                            await node_1.$disconnect(); 
                            return transaction.games.update({
                                where: { AppID: id }, 
                                data: {
                                    Name: name,
                                    Price: newPrice
                                },
                              });
                        }
                    )
                )

            }catch(error){
                status.push("Error Message: " + error)
                status.push('Node_1 is unavailable, attempting to save delete transaction...');
                
                mainnodeGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.temp.create({
                                data: {
                                    AppID: id,
                                    Name: name,
                                    Price: newPrice,
                                    ReleaseDate:"",
                                    EstimatedOwners:"",
                                    PeakCCU:0,                             
                                    RequiredAge :0,                                       
                                    DLCCOUNT:0,
                                    Website:"",
                                    SupportEmail:"",
                                    Publishers:"",
                                    AveragePlaytime:0,                 
                                    MedianPlaytime :0, 
                                    Categories:"",
                                    Genres:"",
                                    Tags:"",
                                    Transact:"update",
                                    Node:"node_1"
                                },
                                });
                        }
                    )
                )

                status.push('Transaction saved in main_node!');
                status.push('Node_1 is now online!');
                status.push('Checking records for saved transactions...');

                // only get the transaction with transact as update
                // put node_1 as the node
                const savedTransactions = await main_node.temp.findMany();

                let transaction;
                let propagationtransaction;
                let deletetransaction;
                
                try{
                        await node_1.$connect(); 

                        if(releasedYear < 2010){
                            transaction = await (

                                node_1.$transaction(
                                    async (transaction) => {
                                        return transaction.games.delete({
                                            where: { AppID: savedTransactions[0].AppID} 
                                        });
                                    }
                                )
                            )

                            status.push('Deleting record in node_1...');

                            propagationtransaction = await (
                                main_node.$transaction(
                                    async (transaction) => {
                                        return transaction.games.delete({
                                            where: { AppID: savedTransactions[0].AppID} 
                                        });
                                    }
                                )
                            )
                            status.push('Deleting record in main_node...');
                            status.push('Delete Success!');
                        }else if(releasedYear >= 2010){
                            status.push('Record does not exist in node_1. Delete will not go through...');
                        }

                        // delete the transaction records in temp
                        status.push('Deleting delete transaction record of saved transactions...');
                        deletetransaction = await (
                            main_node.$transaction(
                                async (transaction) => {
                                    return transaction.temp.delete({where: {AppID: savedTransactions[0].AppID}})
                                }
                            )
                        )
                
                }catch(error){
                    console.log(error);
                }
            }
            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                status: status
            });
        }else if(node == 'node_2'){
            try{
                
                node2Games = await (
                    node_2.$transaction(
                        async (transaction) => {
                            await node_2.$disconnect(); 
                            return transaction.games.delete({
                                where: { AppID: id }
                              });
                        }
                    )
                )

            }catch(error){
                status.push("Error Message: " + error)
                status.push('Node_2 is unavailable, attempting to save deletes with main_node...');
                
                mainnodeGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.temp.create({
                                data: {
                                    AppID: id,
                                    Name: name,
                                    Price: newPrice,
                                    ReleaseDate:"",
                                    EstimatedOwners:"",
                                    PeakCCU:0,                             
                                    RequiredAge :0,                                       
                                    DLCCOUNT:0,
                                    Website:"",
                                    SupportEmail:"",
                                    Publishers:"",
                                    AveragePlaytime:0,                 
                                    MedianPlaytime :0, 
                                    Categories:"",
                                    Genres:"",
                                    Tags:"",
                                    Transact:"update",
                                    Node:"node_2"
                                },
                                });
                        }
                    )
                )

                status.push('Transaction saved in main_node!');
                status.push('Node_2 is now online!');
                status.push('Checking records for saved transactions...');

                // only get the transaction with transact as update
                // put node_1 as the node
                const savedTransactions = await main_node.temp.findMany();

                let transaction;
                let propagatetransaction;
                let deletetransaction;
                
                try{
                    
                    await node_2.$connect(); 
                    if(releasedYear >= 2010){
                        transaction = await (
                            node_2.$transaction(
                                async (transaction) => {
                                    return transaction.games.delete({
                                        where: { AppID: savedTransactions[0].AppID }
                                    });
                                }
                            )
                        )
                        status.push('Deleting records in node_2...');

                        propagatetransaction = await (
                            main_node.$transaction(
                                async (transaction) => {
                                    return transaction.games.delete({
                                        where: { AppID: savedTransactions[0].AppID }
                                    });
                                }
                            )
                        )

                        status.push('Deleting records in main_node...');
                        status.push('Delete Success!');
                    }else if(releasedYear < 2010){
                        status.push('Record not in node_2. Update will not go through...');
                    }
                    
                    deletetransaction = await (
                        main_node.$transaction(
                            async (transaction) => {
                                return transaction.temp.delete({where: {AppID: savedTransactions[0].AppID}})
                            }
                        )
                    )
                    status.push('Deleting saved transaction record...');
                    
                }catch(error){
                    console.log(error);
                }
                
                
                

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

export async function GET(request) {

    let nodeRead;
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
                            return transaction.games.findFirst({ where: {AppID: AppID} });
                        },
                        { isolationLevel: "ReadCommitted" }
                    )
                )
                status.push('Main_node is available!');
                game = mainGames;
            }catch(error){
                status.push("Error message: " + error);

                if (releasedYear < 2010)
                {
                    status.push('Main_node is unavailable, attempting to read from node_1...');
                
                    node1Games = await (
                        node_1.$transaction(
                            async (transaction) => {
                                return transaction.games.findFirst({ where: {AppID: AppID} });
                            },
                            { isolationLevel: "ReadCommitted" }
                        )
                    )
                    status.push('Read from the node_1!');
                    console.log(node1Games)
                    game = node1Games
                    nodeRead = "node_1"
                }else if(releasedYear >= 2010){
                    status.push('Main_node is unavailable, attempting to read from node_2...');

                    node2Games = await (
                        node_2.$transaction(
                            async (transaction) => {
                                return transaction.games.findFirst({ where: {AppID: AppID} });
                            },
                            { isolationLevel: "ReadCommitted" }
                        )
                    )

                    status.push('Read from the node_2!');
                    game = node2Games
                    nodeRead = 'node_2'
                }

                await main_node.$connect(); 
                
                status.push('Main_node is now online!');
            }
            const endTime = Date.now();
            const duration = endTime - startTime;    
 
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
                game = node1Games;
            }catch(error){

                status.push("Error message: " + error);
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
                status.push("Error message: " + error);
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
          price,
          node,
          releasedYear
        } = body

        let savedNode;

        console.log("marker");
        const newPrice = parseFloat(price)
        console.log(releasedYear);
        
        console.log(body);
        
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
                mainGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            await main_node.$disconnect(); 
                            return transaction.games.update({
                                where: { AppID: id }, 
                                data: {
                                    Name: name,
                                    Price: newPrice
                                },
                              });
                        }
                    )
                )
            }catch(error){
                if (releasedYear < 2010){
                    status.push("Error Message: " + error)
                    status.push('Main_node is unavailable, attempting to save updates with node_1...');
                    
                    node1Games = await (
                        node_1.$transaction(
                            async (transaction) => {
                                return transaction.temp.create({
                                    data: {
                                        AppID: id,
                                        Name: name,
                                        Price: newPrice,
                                        ReleaseDate:"",
                                        EstimatedOwners:"",
                                        PeakCCU:0,                             
                                        RequiredAge :0,                                       
                                        DLCCOUNT:0,
                                        Website:"",
                                        SupportEmail:"",
                                        Publishers:"",
                                        AveragePlaytime:0,                 
                                        MedianPlaytime :0, 
                                        Categories:"",
                                        Genres:"",
                                        Tags:"",
                                        Transact:"update",
                                        Node:"node_1"
                                    },
                                    });
                            }
                        )
                    )
    
                    status.push('Transaction saved in node_1!');
                    status.push('Main_node is now online!');
                    status.push('Checking records for saved transactions...');
    
                    // only get the transaction with transact as update
                    // put node_1 as the node
                    const savedTransactions = await node_1.temp.findMany();
    
                    let transaction;
                    let deletetransaction;
                    let propagatetransaction;
                    
                    try{

                        await main_node.$connect(); 
    
                        transaction = await (
                            main_node.$transaction(
                                async (transaction) => {
                                    return transaction.games.update({
                                        where: { AppID: savedTransactions[0].AppID }, 
                                        data: {
                                            Name: savedTransactions[0].Name,
                                            Price: savedTransactions[0].Price
                                        },
                                    });
                                }
                            )
                        )

                        status.push('Updating records in main_node...');

                        propagatetransaction = await (
                            node_1.$transaction(
                                async (transaction) => {
                                    return transaction.games.update({
                                        where: { AppID: savedTransactions[0].AppID }, 
                                        data: {
                                            Name: savedTransactions[0].Name,
                                            Price: savedTransactions[0].Price
                                        },
                                    });
                                }
                            )
                        )

                        status.push('Propagating update to node_1...');
                        status.push('Update Success!');

                        // delete the transaction records in temp node_1
                        status.push('Deleting saved transaction record...');
                        deletetransaction = await (
                            node_1.$transaction(
                                async (transaction) => {
                                    return transaction.temp.delete({where: {AppID: savedTransactions[0].AppID}})
                                }
                            )
                        )
                    
                    }catch(error){
                        console.log(error);
                    }
                    
                }else if (releasedYear >= 2010){
                    status.push("Error Message: " + error)
                    status.push('main_node is unavailable, attempting to save updates with node_2...');
                    
                    node2Games = await (
                        node_2.$transaction(
                            async (transaction) => {
                                return transaction.temp.create({
                                    data: {
                                        AppID: id,
                                        Name: name,
                                        Price: newPrice,
                                        ReleaseDate:"",
                                        EstimatedOwners:"",
                                        PeakCCU:0,                             
                                        RequiredAge :0,                                       
                                        DLCCOUNT:0,
                                        Website:"",
                                        SupportEmail:"",
                                        Publishers:"",
                                        AveragePlaytime:0,                 
                                        MedianPlaytime :0, 
                                        Categories:"",
                                        Genres:"",
                                        Tags:"",
                                        Transact:"update",
                                        Node:"node_1"
                                    },
                                    });
                            }
                        )
                    )
    
                    status.push('Transaction saved in node_2!');
                    status.push('Main_node is now online!');
                    status.push('Checking records for saved transactions...');
    
                    // only get the transaction with transact as update
                    // put node_2 as the node
                    const savedTransactions = await node_2.temp.findMany();
    
                    let transaction;
                    let propagatetransaction;
                    let deletetransaction;
                    
                    try{
                        

                        await main_node.$connect(); 
    
                        transaction = await (
                            main_node.$transaction(
                                async (transaction) => {
                                    return transaction.games.update({
                                        where: { AppID: savedTransactions[0].AppID }, 
                                        data: {
                                            Name: savedTransactions[0].Name,
                                            Price: savedTransactions[0].Price
                                        },
                                    });
                                }
                            )
                        )
                        status.push('Updating records in main_node...');
                    
                        propagatetransaction= await (
                            node_2.$transaction(
                                async (transaction) => {
                                    return transaction.games.update({
                                        where: { AppID: savedTransactions[0].AppID }, 
                                        data: {
                                            Name: savedTransactions[0].Name,
                                            Price: savedTransactions[0].Price
                                        },
                                    });
                                }
                            )
                        )

                        status.push('Propagating update to node_2...');
                        status.push('Update Success!');


                        // delete the transaction records in temp node_1
                        status.push('Deleting saved transaction record...');
                        deletetransaction = await (
                            node_2.$transaction(
                                async (transaction) => {
                                    return transaction.temp.delete({where: {AppID: savedTransactions[0].AppID}})
                                }
                            )
                        )
                    }catch(error){
                        console.log(error);
                    }
                    
                }

                
            }
            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                status: status
            });
        }else if(node == 'node_1'){
            try{

                node1Games = await (
                    node_1.$transaction(
                        async (transaction) => {
                            await node_1.$disconnect(); 
                            return transaction.games.update({
                                where: { AppID: id }, 
                                data: {
                                    Name: name,
                                    Price: newPrice
                                },
                              });
                        }
                    )
                )
                status.push('node_1 is available!');

            }catch(error){
                status.push("Error Message: " + error)
                status.push('Node_1 is unavailable, attempting to save updates with main_node...');
                
                mainnodeGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.temp.create({
                                data: {
                                    AppID: id,
                                    Name: name,
                                    Price: newPrice,
                                    ReleaseDate:"",
                                    EstimatedOwners:"",
                                    PeakCCU:0,                             
                                    RequiredAge :0,                                       
                                    DLCCOUNT:0,
                                    Website:"",
                                    SupportEmail:"",
                                    Publishers:"",
                                    AveragePlaytime:0,                 
                                    MedianPlaytime :0, 
                                    Categories:"",
                                    Genres:"",
                                    Tags:"",
                                    Transact:"update",
                                    Node:"node_1"
                                },
                                });
                        }
                    )
                )

                status.push('Transaction saved in main_node!');
                status.push('Node_1 is now online!');
                status.push('Checking records for saved transactions...');

                // only get the transaction with transact as update
                // put node_1 as the node
                const savedTransactions = await main_node.temp.findMany();
;
                console.log("marker");
                console.log(savedTransactions[0]);
                let transaction;
                let deletetransaction;
                let propagatetransaction;
                
                try{
                    await node_1.$connect();
                    // check if the appid actually exist
                    if (releasedYear < 2010){
                        transaction = await (
                            node_1.$transaction(
                                async (transaction) => {
                                    return transaction.games.update({
                                        where: { AppID: savedTransactions[0].AppID }, 
                                        data: {
                                            Name: savedTransactions[0].Name,
                                            Price: savedTransactions[0].Price
                                        },
                                    });
                                }
                            )
                        )

                        status.push('Updating records in node_1...');

                        propagatetransaction = await (
                            main_node.$transaction(
                                async (transaction) => {
                                    return transaction.games.update({
                                        where: { AppID: savedTransactions[0].AppID }, 
                                        data: {
                                            Name: savedTransactions[0].Name,
                                            Price: savedTransactions[0].Price
                                        },
                                    });
                                }
                            )
                        )

                        status.push('Propagating update to main_node...');
                        status.push('Update Success!');
                    }else if(releasedYear >= 2010){
                        status.push('Record not in node_1. Update will not go through...');
                    }
                    
                    // delete the transaction records in temp
                    status.push('Deleting saved transaction record...');
                    deletetransaction = await (
                        main_node.$transaction(
                            async (transaction) => {
                                return transaction.temp.delete({where: {AppID: savedTransactions[0].AppID}})
                            }
                        )
                    )
                }catch(error){
                    console.log(error);
                }
            }

            const endTime = Date.now();
            const duration = endTime - startTime;     
            
            return NextResponse.json({
                game: game,
                transactionTime: `${duration} ms`,
                status: status
            });

        }else if(node == 'node_2'){
            try{
                
                node2Games = await (
                    node_2.$transaction(
                        async (transaction) => {
                            await node_2.$disconnect(); 
                            return transaction.games.update({
                                where: { AppID: id }, 
                                data: {
                                    Name: name,
                                    Price: newPrice
                                },
                              });
                        }
                    )
                )
                status.push('node_1 is available!');

            }catch(error){
                status.push("Error Message: " + error)
                status.push('Node_2 is unavailable, attempting to save updates with main_node...');
                
                mainnodeGames = await (
                    main_node.$transaction(
                        async (transaction) => {
                            return transaction.temp.create({
                                data: {
                                    AppID: id,
                                    Name: name,
                                    Price: newPrice,
                                    ReleaseDate:"",
                                    EstimatedOwners:"",
                                    PeakCCU:0,                             
                                    RequiredAge :0,                                       
                                    DLCCOUNT:0,
                                    Website:"",
                                    SupportEmail:"",
                                    Publishers:"",
                                    AveragePlaytime:0,                 
                                    MedianPlaytime :0, 
                                    Categories:"",
                                    Genres:"",
                                    Tags:"",
                                    Transact:"update",
                                    Node:"node_2"
                                },
                                });
                        }
                    )
                )

                status.push('Transaction saved in main_node!');
                status.push('Node_2 is now online!');
                status.push('Checking records for saved transactions...');

                // only get the transaction with transact as update
                // put node_1 as the node
                const savedTransactions = await main_node.temp.findMany();

                let transaction;
                let deletetransaction;
                let propagatetransaction;

                try{
                    
                    await node_2.$connect(); 

                    if (releasedYear >= 2010){

                        transaction = await (
                            node_2.$transaction(
                                async (transaction) => {
                                    return transaction.games.update({
                                        where: { AppID: savedTransactions[0].AppID }, 
                                        data: {
                                            Name: savedTransactions[0].Name,
                                            Price: savedTransactions[0].Price
                                        },
                                    });
                                }
                            )
                        )

                        status.push('Updating records in node_2...');
    
                        propagatetransaction = await (
                            main_node.$transaction(
                                async (transaction) => {
                                    return transaction.games.update({
                                        where: { AppID: savedTransactions[0].AppID }, 
                                        data: {
                                            Name: savedTransactions[0].Name,
                                            Price: savedTransactions[0].Price
                                        },
                                    });
                                }
                            )
                        )

                        status.push('Propagating update to main_node...');
                        status.push('Update Success!');
                    }else if (releasedYear < 2010){
                        status.push('Record not in node_2. Update will not go through...');
                    }
                
                    deletetransaction = await (
                        main_node.$transaction(
                            async (transaction) => {
                                return transaction.temp.delete({where: {AppID: savedTransactions[0].AppID}})
                            }
                        )
                    )

                    status.push('Deleting saved transaction record...');
                
                }catch(error){
                    console.log(error);
                }

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
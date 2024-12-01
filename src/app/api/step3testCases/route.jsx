import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_2 } from '../../../../prisma/client';


export async function GET(request) {
    try {
        let status = 'nothing'
        const { searchParams } = new URL(request.url);

        console.log("this part run");
        
        const AppID = searchParams.get('appId');
        const testType = searchParams.get('testType');
        const isolationLevel = searchParams.get('isolationLevel');
        const node = searchParams.get('node');

        let game = {};

        const validIsolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
        
        if (!AppID) {
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }
        const selectedIsolationLevel = validIsolationLevels.includes(isolationLevel) ? isolationLevel : undefined;

        const filters = { AppID: { contains: AppID } };

        if (testType === "read") {
            const startTime = Date.now();

            if(node == 'main_node'){
                try{
                    const mainGames = await (
                        main_node.$transaction(
                            async (transaction) => {
                                main_node.$disconnect();
                                return transaction.games.findFirst({ where: filters });
                            },
                            { isolationLevel: selectedIsolationLevel }
                        )
                    )
                    
                    status = 'it read from the main_node';
                    console.log(mainGames);

                    game = mainGames;
                    
                }catch(error){

                    status = 'Main node is unavailable, reading from the node_2';

                    const node2Games = await (
                        node_2.$transaction(
                            async (transaction) => {
                                return transaction.games.findFirst({ where: filters });
                            },
                            { isolationLevel: selectedIsolationLevel }
                        )
                    )

                    console.log(node2Games);

                    game = node2Games;

                    await main_node.$connect(); 
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

            if(node == 'node_2'){
                try{

                    const node2Games = await (
                        node_2.$transaction(
                            async (transaction) => {
                                node_2.$disconnect();
                                return transaction.games.findFirst({ where: filters });
                            },
                            { isolationLevel: selectedIsolationLevel }
                        )
                    )
                    
                    status = 'it read from the node_2';
                    console.log(node2Games);
                    game = node2Games;
                    
                }catch(error){
                    console.log("the node 2 errors");

                    status = 'Node_2 is unavailable, reading from the main_node';

                    const mainGames = await (
                        main_node.$transaction(
                            async (transaction) => {
                                node_2.$connect();
                                return transaction.games.findFirst({ where: filters });
                            },
                            { isolationLevel: selectedIsolationLevel }
                        )
                    )

                    console.log(mainGames);

                    game = mainGames;
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
            
        }
        else if(testType === "update"){

        }
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}
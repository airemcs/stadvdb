import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_1, node_2 } from '../../../../prisma/client';
import { stringify } from 'querystring';

export async function GET(request) {
    const logs = [];
    try {
        logs.push('Processing GET request');

        const { searchParams } = new URL(request.url);

        const AppID = searchParams.get('appId');
        const testType = searchParams.get('testType');
        const isolationLevel = searchParams.get('isolationLevel');
        const validIsolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
        let filters = {};

        if (!AppID) {
            logs.push('AppID is required');
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }

        if (testType == 2 || testType == 3 || testType == 1) {
            filters = { AppID: AppID };
            logs.push('Strict AppID filter applied');
        } else {
            filters = { AppID: {contains: AppID} };
            logs.push('Looking for AppID');
        }

        const selectedIsolationLevel = "RepeatableRead";
        const startTime = Date.now();

        const performRead = async (node, nodeName) => {
            logs.push(`Attempting to read game on ${nodeName}`);
            try {
                const result = await node.$transaction(
                    async (transaction) => transaction.games.findFirst({ where: filters }),
                    { isolationLevel: "RepeatableRead" }
                );
                if (result) {
                    logs.push(`Successfully read game on ${nodeName}`);
                } else {
                    logs.push(`No game found on ${nodeName}`);  
                }
                return result;
            } catch (error) {
                logs.push(`Error reading game on ${nodeName}`);
                console.error(`Error reading game on ${nodeName}:`, error);
                return null;
            }
        };

        const [mainGames, node1Games, node2Games] = await Promise.all([
            performRead(main_node, 'Main_Node'),
            performRead(node_1, 'Node_1'),
            performRead(node_2, 'Node_2')
        ]);

        const endTime = Date.now();
        const duration = endTime - startTime;
        logs.push(`Transaction duration: ${duration} ms`);
        
        const totalGames = {
            main_node: { games: mainGames },
            node_1: { games: node1Games },
            node_2: { games: node2Games },
        };

        logs.push('GET request processed successfully');
        return NextResponse.json({
            totalGames,
            transactionTime: `${duration} ms`,
            isolationLevel: "RepeatableRead",
            logs,
        });

    } catch (error) {
        logs.push(`Error fetching games: ${error.message}`);
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games', logs }, { status: 500 });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function PUT(request) {
    const logs = []; 

    const body = await request.json();
    const {
        id,
        name,
        price,
        isolationLevel,
        type
    } = body;

    const validIsolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
    const selectedIsolationLevel = "RepeatableRead";

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.Name = name;
    if (price !== undefined) dataToUpdate.Price = parseFloat(price);

    const STRAPP = id;
    const startTime = Date.now();

    const updateNode = async (node, nodeName) => {
        await delay(500); 
        logs.push(`Attempting to update on ${nodeName}`); 
        try {
            const result = await node.$transaction(async (transaction) => {
                return transaction.games.update({
                    where: { AppID: STRAPP },
                    data: dataToUpdate
                });
            }, { isolationLevel: selectedIsolationLevel });
            logs.push(`Successfully updated on ${nodeName}`);
            return result;
        } catch (error) {
            logs.push(`Error updating game at ${nodeName}`); 
            console.error(`Error updating game at ${nodeName}:`, error);
            return null;
        }
    };

    const findGame = async (node, nodeName) => {

        logs.push(`Attempting to read game on ${nodeName}`); 
        try {
            const result = await node.$transaction(
                async (transaction) => transaction.games.findFirst({ where: { AppID: id } }),
                { isolationLevel: selectedIsolationLevel }
            );
            logs.push(`Successfully read game on ${nodeName}`); 
            return result;
        } catch (error) {
            logs.push(`Error finding game at ${nodeName}`); 
            console.error(`Error finding game at ${nodeName}:`, error);
            return null;
        }
    };

    let results;
    if (type == 2) {
         results = await Promise.allSettled([
            updateNode(main_node, 'main_node'),
            updateNode(node_1, 'Node 1'),
            updateNode(node_2, 'Node 2'),
            findGame(main_node, 'main_node'),
            findGame(node_1, 'Node 1'),
            findGame(node_2, 'Node 2')
        ]);
    } else if (type == 3) {
        results = await Promise.allSettled([
            updateNode(main_node, 'main_node'),
            updateNode(node_1, 'Node 1'),
            updateNode(node_2, 'Node 2'),
        ]);
    }

    const [updateMainResult, updateNode1Result, updateNode2Result, mainGames, node1Games, node2Games] = results.map(result => result.status === 'fulfilled' ? result.value : null);

    if (updateMainResult || updateNode1Result || updateNode2Result) {
        const totalGames = {
            updatedGameMain: { games: updateMainResult },
            updatedGameNode1: { games: updateNode1Result },     
            updatedGameNode2: { games: updateNode2Result },
            main_node: { games: mainGames },
            node_1: { games: node1Games },
            node_2: { games: node2Games },
        };

        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(node2Games);
        console.log(mainGames);
        return NextResponse.json({
            totalGames,
            isolationLevel: selectedIsolationLevel,
            transactionTime: `${duration} ms`,
            logs, 
        });
    }
}
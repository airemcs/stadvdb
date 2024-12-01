import { NextRequest, NextResponse } from 'next/server';
import { main_node, node_2 } from '../../../../prisma/client';
import { stringify } from 'querystring';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const AppID = searchParams.get('appId');
        const testType = searchParams.get('testType');
        const isolationLevel = searchParams.get('isolationLevel');
        const validIsolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
        
        if (!AppID) {
            return NextResponse.json({ message: 'AppID is required' }, { status: 400 });
        }
        const selectedIsolationLevel = validIsolationLevels.includes(isolationLevel) ? isolationLevel : undefined;

        const filters = { AppID: { contains: AppID } };


            const startTime = Date.now();
            const [mainGames, node2Games] = await Promise.all([
                main_node.$transaction(
                    async (transaction) => {
                        return transaction.games.findFirst({ where: filters });
                    },
                    { isolationLevel: selectedIsolationLevel }
                ),
                node_2.$transaction(
                    async (transaction) => {
                        return transaction.games.findFirst({ where: filters });
                    },
                    { isolationLevel: selectedIsolationLevel }
                )
            ]);
            const endTime = Date.now();
            const duration = endTime - startTime;     
            const totalGames = {
                main_node: { games: mainGames },
                node_2: { games: node2Games },
            };

            return NextResponse.json({
                totalGames,
                transactionTime: `${duration} ms`,
                isolationLevel
            });
        
    } catch (error) {
        console.error('Error fetching games:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        console.log("RN");
        const body = await request.json();
        
        const {
            id,
            name,
            price,
            isolationLevel
        } = body;
        
        const validIsolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
        const selectedIsolationLevel = validIsolationLevels.includes(isolationLevel) ? isolationLevel : undefined;

        const dataToUpdate = {};
        if (name !== undefined) dataToUpdate.Name = name;
        if (price !== undefined) dataToUpdate.Price = parseFloat(price);
        
        const STRAPP = id
        
        const startTime = Date.now();
        const [updatedGame1, mainGames, node2Games, updatedGame2] = await Promise.all([
            main_node.$transaction(async (transaction) => {
                console.log('Inside transaction - Value of STRAPP:', STRAPP);
                return transaction.games.update({
                    where: { AppID: STRAPP },
                    data: dataToUpdate
                });
            }, { isolationLevel: selectedIsolationLevel }),
     
            main_node.$transaction(
                async (transaction) => {
                    return transaction.games.findFirst({ where: {AppID: id} });
                },
                { isolationLevel: selectedIsolationLevel }
            ),
            node_2.$transaction(
                async (transaction) => {
                    return transaction.games.findFirst({ where: {AppID: id} });
                },
                { isolationLevel: selectedIsolationLevel }
            ),

            node_2.$transaction(async (transaction) => {
                console.log('Inside transaction - Value of STRAPP:', STRAPP);
                return transaction.games.update({
                    where: { AppID: STRAPP },
                    data: dataToUpdate
                });
            }, { isolationLevel: selectedIsolationLevel })
        ]);

        const totalGames = {
            updatedGame1: { games: updatedGame1 },
            updatedGame2:{ games: updatedGame2 },
            main_node: { games: mainGames },
            node_2: { games: node2Games },
        };
        const endTime = Date.now();
        const duration = endTime - startTime;     
        return NextResponse.json({
            totalGames,
            isolationLevel: selectedIsolationLevel,
            transactionTime: `${duration} ms`,
        });

    } catch (error) {
        console.error('Error updating game:', error);
        return NextResponse.json(
            { error: 'Failed to update game' },
            { status: 500 }
        );
    }
}
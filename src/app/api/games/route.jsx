import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page'), 10) || 1;
      const limit = parseInt(searchParams.get('limit'), 10) || 50;
      const skip = (page - 1) * limit;
      const games = await prisma.games.findMany({
        skip: skip,
        take: limit,
      });
  
      if (games.length === 0) {
        return NextResponse.json({ message: 'No games found' }, { status: 404 });
      }
  
      return NextResponse.json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
  }

export async function POST() {
  const session = await getServerSession(authOptions);
  const { description, date, from, to, finished, email } = await request.json();

  if (!session || !email || session.user?.email !== email) {
    return NextResponse.json({ error: 'Unauthenticated or email mismatch' }, { status: 401 });
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        email: email,
        description,
        date: new Date(date),
        from: new Date(from),
        to: new Date(to),
        finished,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT() {
  const session = await getServerSession(authOptions);
  const { id, finished, email } = await request.json();

  if (!session || !email || session.user?.email !== email) {
    return NextResponse.json({ error: 'Unauthenticated or email mismatch' }, { status: 401 });
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { finished }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  const { id, email } = await request.json();

  if (!session || !email || session.user?.email !== email) {
    return NextResponse.json({ error: 'Unauthenticated or email mismatch' }, { status: 401 });
  }

  try {
    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
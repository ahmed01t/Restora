import { NextResponse, type NextRequest } from 'next/server';
import { initialProperties, type Property } from '@/lib/properties';
import { isAdmin } from '@/lib/admin-auth';

// In-memory property store for persistence during runtime
let propertiesList: Property[] = [...initialProperties];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const query = searchParams.get('q');

  let results = [...propertiesList];

  if (status && status !== 'all') {
    results = results.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  }

  if (type && type !== 'All homes') {
    results = results.filter((p) => p.type.toLowerCase() === type.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ properties: results });
}

export async function POST(request: NextRequest) {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const newProperty: Property = {
      id: Date.now(),
      name: body.name || 'Untitled Home',
      location: body.location || 'Undisclosed Location',
      price: Number(body.price) || 2000,
      type: body.type || 'House',
      bedrooms: Number(body.bedrooms) || 3,
      bathrooms: Number(body.bathrooms) || 2,
      size: Number(body.size) || 2000,
      status: body.status || 'Draft',
      image: body.image || 'photo-1600210492486-724fe5c67fb0',
      tag: body.tag || 'Just listed',
      updated: 'Just now',
      description: body.description || 'Thoughtfully crafted residence prioritizing natural light, organic materials, and desert tranquility.',
      amenities: body.amenities && Array.isArray(body.amenities) ? body.amenities : ['Mountain Views', 'Private Patio', 'Solar Array']
    };

    propertiesList.unshift(newProperty);
    return NextResponse.json({ ok: true, property: newProperty }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid property payload' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const index = propertiesList.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    propertiesList[index] = {
      ...propertiesList[index],
      ...body,
      updated: 'Just now'
    };

    return NextResponse.json({ ok: true, property: propertiesList[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const authorized = await isAdmin();
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');
  if (!idStr) {
    return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
  }

  const id = Number(idStr);
  const initialLength = propertiesList.length;
  propertiesList = propertiesList.filter((p) => p.id !== id);

  if (propertiesList.length === initialLength) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deletedId: id });
}


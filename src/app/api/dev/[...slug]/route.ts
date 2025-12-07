import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  // ---------------------------------------------------------
  // 🛡️ Triple Guard Security Check
  // ---------------------------------------------------------

  // 1. APP_ENV Check
  if (process.env.APP_ENV !== 'local') {
    return NextResponse.json({ error: 'Not Found (APP_ENV!=local)' }, { status: 404 });
  }

  // 2. IP Address Check (Localhost only)
  // ...

  // 3. X-Forwarded-For Check (No Proxy allowed from external)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // If it exists, it must be a local IP.
    // XFF can be comma separated list. We check the first one.
    const clientIp = forwardedFor.split(',')[0].trim();
    const localIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
    if (!localIps.includes(clientIp)) {
        console.error(`[DevAPI] Blocked Proxy access from: ${clientIp}`);
        return NextResponse.json({ error: `Forbidden: Proxy detected (IP: ${clientIp})` }, { status: 403 });
    }
  }

  // ---------------------------------------------------------
  // Logic
  // ---------------------------------------------------------

  const { slug } = await params;
  const action = slug[0];

  const ALLOWED_MODELS = ['user', 'account', 'session', 'repository', 'transaction', 'verificationtoken'];

  // Define a generic delegate capability
  // Define a generic delegate capability
  type DBRecord = Record<string, unknown>;
  
  interface GenericDelegate {
    findMany: (args?: { take?: number; orderBy?: Record<string, string> }) => Promise<DBRecord[]>;
    findUnique: (args: { where: { id: string } }) => Promise<DBRecord | null>;
    update: (args: { where: { id: string }; data: DBRecord }) => Promise<DBRecord>;
    create: (args: { data: DBRecord }) => Promise<DBRecord>;
    delete: (args: { where: { id: string } }) => Promise<DBRecord>;
  }

  // Type-safe mapping
  const getDelegate = (name: string): GenericDelegate | null => {
    switch (name.toLowerCase()) {
      case 'user': return prisma.user as unknown as GenericDelegate;
      case 'account': return prisma.account as unknown as GenericDelegate;
      case 'session': return prisma.session as unknown as GenericDelegate;
      case 'repository': return prisma.repository as unknown as GenericDelegate;
      case 'transaction': return prisma.transaction as unknown as GenericDelegate;
      case 'verificationtoken': return prisma.verificationToken as unknown as GenericDelegate;
      default: return null;
    }
  };

  try {
    const body = await req.json().catch(() => ({})); 

    switch (action) {
      case 'ping':
        return NextResponse.json({ message: 'pong', env: process.env.APP_ENV });

      case 'models':
        return NextResponse.json({ models: ALLOWED_MODELS });

      case 'list': {
        const { model } = body;
        const delegate = getDelegate(model);
        if (!delegate) {
          return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
        }
        
        const rows = await delegate.findMany({
          take: 100,
          orderBy: { id: 'desc' },
        });
        return NextResponse.json({ data: rows });
      }

      case 'get': {
         const { model, id } = body;
         const delegate = getDelegate(model);
         if (!delegate) {
           return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
         }
         
         const data = await delegate.findUnique({
           where: { id },
         });
         return NextResponse.json({ data });
      }

      case 'update': {
        const { model, id, data } = body;
        const delegate = getDelegate(model);
        if (!delegate) {
          return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
        }
        
        const result = await delegate.update({
          where: { id },
          data,
        });
        return NextResponse.json({ data: result });
      }

      case 'create': {
        const { model, data } = body;
        const delegate = getDelegate(model);
        if (!delegate) {
           return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
        }
        
        const result = await delegate.create({
          data,
        });
        return NextResponse.json({ data: result });
      }

       case 'delete': {
        const { model, id } = body;
        const delegate = getDelegate(model);
        if (!delegate) {
           return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
        }
        
        const result = await delegate.delete({
          where: { id },
        });
        return NextResponse.json({ data: result });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[DevAPI] Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

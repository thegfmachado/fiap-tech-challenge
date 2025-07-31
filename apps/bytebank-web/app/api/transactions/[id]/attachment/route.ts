import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createServerClient } from "@fiap-tech-challenge/database/server";
import { StorageService, AttachmentService } from "@fiap-tech-challenge/services";
import { handleResponseError } from "@fiap-tech-challenge/services/http";
import { createTransactionService } from "@bytebank/lib/services/transaction-service.factory";

interface RouteParams {
  id: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }
    
    const maxSize = 10 * 1024 * 1024; 
    if (file.size > maxSize) {
      return new NextResponse('File size exceeds 10MB limit', { status: 400 });
    }
    
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain', 'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return new NextResponse('File type not allowed', { status: 400 });
    }

    const cookieStore = await cookies();
    const client = await createServerClient(cookieStore);
    const storageService = new StorageService(client);
    const attachmentService = new AttachmentService(storageService);
    const transactionService = await createTransactionService();
    
    const attachment = await attachmentService.uploadTransactionAttachment(id, file);
    
    await transactionService.update(id, {
      attachment_url: attachment.url,
      attachment_name: attachment.name
    });

    return NextResponse.json(attachment);
  } catch (err) {
    console.error('Upload error:', err);
    return handleResponseError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return new NextResponse('File name is required', { status: 400 });
    }

    const cookieStore = await cookies();
    const client = await createServerClient(cookieStore);
    const storageService = new StorageService(client);
    const attachmentService = new AttachmentService(storageService);
    const transactionService = await createTransactionService();

    await attachmentService.deleteTransactionAttachment(id, fileName);
    
    await transactionService.update(id, {
      attachment_url: null,
      attachment_name: null
    });

    return NextResponse.json({ message: 'Attachment deleted successfully' });
  } catch (err) {
    console.error('Delete attachment error:', err);
    return handleResponseError(err);
  }
}

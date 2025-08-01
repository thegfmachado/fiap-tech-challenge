import { NextRequest, NextResponse } from "next/server";

import { handleResponseError } from "@fiap-tech-challenge/services/http";
import { createAttachmentService } from "@bytebank/lib/services/attachment-service.factory";

interface RouteParams {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return new NextResponse('File name is required', { status: 400 });
    }

    const attachmentService = await createAttachmentService();

    const blob = await attachmentService.downloadTransactionAttachment(id, fileName);
    
    const originalFileName = fileName.split('_').slice(1).join('_');
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${originalFileName}"`,
      },
    });
  } catch (err) {
    console.error('Download error:', err);
    return handleResponseError(err);
  }
}

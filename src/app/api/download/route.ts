
// app/api/capture/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
    const { urls, width, fileType = 'png' } = await request.json();

    if (!urls) {
        return NextResponse.json({ error: 'URLs is required' }, { status: 400 });
    }

    try {
        const screenshots = [];
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        for (const url of urls) {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });
            await page.setViewport({
                width: Number(width) || 1920,
                height: 1024
            });
            const buffer = await page.screenshot({ fullPage: true });

            screenshots.push({
                fileName: `${url.replace(/https?:\/\//, '').replace(/\//, '_')}.${fileType}`,
                fileBuffer: buffer.toString('base64'),
                contentType: `image/${fileType}`,
            });
            await page.close();
        }

        await browser.close();

        if (screenshots.length === 0) {
            return new NextResponse('', { status: 500 });
        }

        return new NextResponse(JSON.stringify(screenshots), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get url from the webpage' }, { status: 500 });
    }
}
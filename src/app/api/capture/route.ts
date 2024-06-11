// app/api/capture/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import chrome from 'chrome-aws-lambda';

export async function POST(request: Request) {
    const { url, width } = await request.json();
    console.log(width);

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.setViewport({
            width: Number(width),
            height: 1024
        });
        const screenshot = await page.screenshot({ fullPage: true });

        await browser.close();

        return new NextResponse(screenshot, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to capture the webpage' }, { status: 500 });
    }
}
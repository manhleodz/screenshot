// app/api/capture/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { chromium } from 'playwright';

export async function POST(request: Request) {
    const { url, width } = await request.json();
    console.log({ url, width });

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const browser = await chromium.launch({ headless: false });
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.setViewportSize({
            width: Number(width),
            height: 1024
        });

        await autoScroll(page);

        // Cuộn trở lại lên trên cùng
        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        await page.waitForTimeout(2000);

        const screenshot = await page.screenshot({ fullPage: true });

        // await browser.close();

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

async function autoScroll(page: any) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}
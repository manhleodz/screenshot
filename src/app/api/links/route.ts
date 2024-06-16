
// app/api/capture/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
    const { url } = await request.json();

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        let headerLinks = await page.$$eval('a', (links) => {
            return links.map((link) => link.href);
        });

        let navbarLinks = await page.$$eval('a', (links) => {
            return links.map((link) => link.href);
        });

        let uniqueLinks = [...navbarLinks, ...headerLinks].filter((value, index, self) =>
            self.indexOf(value) === index
        );

        const domain = url.split('/')[0] + "//" + url.split('/')[2]
        
        const validLinks = uniqueLinks.filter(url => url.startsWith(domain));

        console.log(validLinks);
        
        await browser.close();

        return new NextResponse(JSON.stringify(validLinks), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get url from the webpage' }, { status: 500 });
    }
}

// app/api/capture/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import chrome from 'chrome-aws-lambda';

export async function POST(request: Request) {
    const { url } = await request.json();

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

        let headerLinks = await page.$$eval('header a', (links) => {
            return links.map((link) => link.href);
        });

        let navbarLinks = await page.$$eval('nav a', (links) => {
            return links.map((link) => link.href);
        });

        let uniqueLinks = [...navbarLinks, ...headerLinks].filter((value, index, self) =>
            self.indexOf(value) === index
        );

        const domain = url.split('/')[0] + "//" + url.split('/')[2]

        const validLinks = uniqueLinks.filter(url => url.startsWith(domain));

        console.log(validLinks);

        // // Loop through each link and take a screenshot
        // for (const link of links) {
        //     await page.goto(link);
        //     const fileName = `${link.replace(/https?:\/\//, '').replace(/\//, '_')}.png`;
        //     await page.screenshot({ path: fileName });
        //     console.log(`Screenshot taken for: ${link}`);
        // }
        await browser.close();

        return new NextResponse(JSON.stringify(validLinks), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get url from the webpage' }, { status: 500 });
    }
}
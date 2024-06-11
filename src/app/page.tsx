"use client"
import ListLink from "@/components/ListLink";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [excuting, setExcuting] = useState(false);
  const [selectedWidth, setSelectedWidth] = useState(1920);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (excuting) return;
    setExcuting(true);
    try {
      const response = await axios.post("/api/capture", { url, width: selectedWidth }, { responseType: 'arraybuffer' });
      if (!response) {
        throw new Error('Failed to capture the webpage');
      }

      const buffer = await response.data;
      console.log(buffer);
      
      const blob = new Blob([buffer], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);
      setScreenshotUrl(imageUrl);
      setExcuting(false);
    } catch (error) {
      setExcuting(false);
      console.error(error);
    }
  };

  return (
    <div
      className=" h-screen w-screen flex flex-col justify-start items-center"
      style={{
        backgroundImage: "url(https://a-static.besthdwallpaper.com/black-panther-s-name-made-his-face-wallpaper-1680x1050-101828_5.jpg)",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      <h1 className=" text-white text-[40px] font-[600] mt-[100px]">Nhập địa chỉ trang web cần chụp</h1>
      <form onSubmit={handleSubmit} className="my-10 w-full flex flex-col items-center">
        <div className="relative flex w-[50%] max-lg:w-[70%] max-md:w-full items-center">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="search" id="search"
            className="block w-full  p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Nhập địa chỉ url của website nhé..." required
          />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>

        <select id="countries" onChange={(e: any) => setSelectedWidth(e.target.value)} value={selectedWidth} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 mt-2 p-2.5 ">
          <option value="1920">1920px</option>
          <option value="1536">1536px</option>
          <option value="1280">1280px</option>
          <option value="1024">1024px</option>
          <option value="768">768px</option>
          <option value="640">640px</option>
        </select>
      </form>
      <div className=" w-full h-[500px] flex items-center justify-center">
        {excuting ? (
          <div className=" w-[700px] h-[500px] flex flex-col items-center justify-center border border-white p-2 rounded-2xl bg-gray-900">
            <center>
              <div className="loader">
                <div className="load-inner load-one"></div>
                <div className="load-inner load-two"></div>
                <div className="load-inner load-three"></div>
                <span className="loader-text">Loading</span>
              </div>
            </center>
          </div>
        ) : (
          <>
            <div className=" w-[700px] h-[500px] flex flex-col items-center justify-start border border-white p-2 rounded-2xl bg-gray-900">
              <div className=" overflow-auto ">
                {screenshotUrl && (
                  <Image src={screenshotUrl}
                    alt="screen shot"
                    width={700}
                    height={500}
                    className=" rounded-xl"
                  />
                )}
              </div>
            </div>
          </>
        )}
        <ListLink url={url} selectedWidth={selectedWidth}/>
      </div>
    </div>
  );
};
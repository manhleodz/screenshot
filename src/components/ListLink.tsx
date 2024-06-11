"use-client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ListLink(props: any) {

    const [list, setList] = useState([]);
    const [issuccessfull, setIsSuccessfull] = useState(false);

    const getData = async () => {
        setIsSuccessfull(false);
        try {
            const response = await axios.post("/api/links", { url: props.url, selectedWidth: props.selectedWidth });
            setIsSuccessfull(true)
            setList(response.data);
            if (!response) {
                throw new Error('Failed to capture the webpage');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const download = async () => {
        try {
            const response = await axios.post("/api/download", { urls: list });
            if (!response) {
                throw new Error('Failed to capture the webpage');
            }
            const screenshots = response.data;

            for (const { fileName, fileBuffer, contentType } of screenshots) {
                const downloadLink = document.createElement('a');

                downloadLink.href = `data:image/jpeg;base64,${fileBuffer}`;
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        return () => {
            setList([]);
            setIsSuccessfull(false);
        }
    }, [props.url]);

    return (
        <>
            {props.url && (

                <div className=" w-[300px] h-[500px] overflow-auto break-words break-all bg-white flex flex-col items-center p-2">
                    {issuccessfull ? (
                        <>
                            <button
                                onClick={download}
                                className='text-white h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                            >Download all</button>
                            <ul>
                                {list.map((link, index) => (
                                    <>
                                        <li onClick={() => window.open(link, '_blank')} key={index} className='hover:text-blue-600 cursor-pointer'>
                                            {link}
                                        </li>
                                    </>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={getData}
                                className='text-white h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                            >Get Link</button>
                        </>
                    )}
                </div >
            )}
        </>
    )
}

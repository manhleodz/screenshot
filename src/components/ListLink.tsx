"use-client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ListLink(props: any) {

    const [list, setList] = useState([]);
    const [excuting, setExcuting] = useState(false);
    const [issuccessfull, setIsSuccessfull] = useState(false);

    const getData = async () => {
        setIsSuccessfull(false);
        setExcuting(true);
        try {
            const response = await axios.post("/api/links", { url: props.url, selectedWidth: props.selectedWidth });
            if (response.data && response.data.length > 0) {
                setList(response.data);
            }
            setIsSuccessfull(true)
            if (!response) {
                throw new Error('Failed to capture the webpage');
            }
        } catch (error) {
            console.error(error);
        }
        setExcuting(false)
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

                <div className=" w-[300px] h-[500px] rounded-xl mx-2 break-words break-all bg-white flex flex-col items-center p-2">
                    <div className=" w-[300px] h-[500px] rounded-xl mx-2 overflow-auto flex flex-col items-center">
                        {(issuccessfull && list.length > 0) ? (
                            <>
                                <div className=' w-full flex items-center justify-center relative'>
                                    <button
                                        onClick={download}
                                        className='text-white h-10 bg-blue-700 hover:bg-blue-800 no-underline focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                                    >Download</button>
                                    {/* <div className="checkbox-wrapper-4 absolute right-0">
                                        <input className="inp-cbx" id="morning" type="checkbox" />
                                        <label className="cbx" htmlFor="morning">
                                            <span> <svg width="12px" height="10px"> <use xlinkHref="#check-4"></use> </svg></span>
                                            <span>All</span>
                                        </label>
                                        <svg className="inline-svg"> <symbol id="check-4" viewBox="0 0 12 10"> <polyline points="1.5 6 4.5 9 10.5 1">
                                        </polyline> </symbol> </svg>
                                    </div> */}
                                </div>
                                <ul className=' p-1'>
                                    {list && list.map((link, index) => (
                                        <>
                                            <li title={link} onClick={() => window.open(link, '_blank')} id={link} className='hover:text-blue-600 text-black underline cursor-pointer'>
                                                <input />
                                                <h1>{link}</h1>
                                            </li>
                                        </>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={getData}
                                    className='text-white h-10 bg-blue-700 hover:bg-blue-800 no-underline focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                                >Get Link
                                </button>
                                {excuting ? (
                                    <div className=" flex items-center justify-center border rounded-full border-white p-2 bg-white">
                                        <center>
                                            <div className="loader rounded-full">
                                                <div className="load-inner load-one"></div>
                                                <div className="load-inner load-two"></div>
                                                <div className="load-inner load-three"></div>
                                                <span className="loader-text">Loading</span>
                                            </div>
                                        </center>
                                    </div>
                                ) : (
                                    <h1>Không có link</h1>
                                )}
                            </>
                        )}
                    </div>
                </div >
            )}
        </>
    )
}

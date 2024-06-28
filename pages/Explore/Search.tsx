import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import {
    Checkbox
} from "@material-tailwind/react";
import SearchItem from '@/components/SearchItem';
import Loading from '@/components/Loading';
import { getCharacters } from '@/utils/axios';
import { ICharacter } from '@/utils/types';

import { LanguagesX } from '@/utils/constants';
import SearchSVG from '@/assets/images/icon/search.svg';
import ArrowLeft from '@/assets/images/icon/arrow_left.svg';

const Search = (): React.JSX.Element => {
    const navigate = useNavigate()
    const location = useLocation();

    const searchRef = useRef<HTMLInputElement>(null)

    const [keywords, setKeywords] = useState<string>("")
    const [tags, setTags] = useState<Array<string>>([])
    const [langs, setLangs] = useState<Array<string>>([])

    const [result, setResult] = useState<Array<ICharacter>>([])
    const [scrollData, setScrollData] = useState<Array<ICharacter>>([])
    const [hasMoreValue, setHasMoreValue] = useState<boolean>(false);

    const tagFilter = [
        "Featured",
        "Hot",
        "New"
    ]

    function onChangeTag(item: string) {
        const arr = [...tags]
        const index = tags.indexOf(item.toLowerCase())
        if(index >=0 ) {
            arr.splice(index, 1)
            setTags(arr)
        } else {
            arr.push(item.toLowerCase())
            setTags(arr)
        }
    }

    function onChangeLang(item: any) {
        const arr = [...langs]
        const index = arr.indexOf(item.code)
        if(index >= 0 ) {
            arr.splice(index, 1)
            setLangs(arr)
        } else {
            arr.push(item.code)
            setLangs(arr)
        }
    }

    const loadScrollData = async () => {
        try {
            // get more data from backend
            setScrollData(result.slice(0, scrollData.length + 3));
        } catch (err) {
            console.log(err);
        }
    };

    const handleOnRowsScrollEnd = () => {
        if (scrollData.length < result.length) {
            setHasMoreValue(true);
            loadScrollData();
        } else {
            setHasMoreValue(false);
        }
    };

    function searchBae() {
        const data = {
            keywords: keywords,
            tags: tags,
            langs: langs
        }
        getCharacters(data).then( res => {
            // console.log(res.data)
            if(res.status == 200) {
                // setResult(res.data)
                setScrollData(res.data)
            }
        }).catch( e => console.log(e))
    }

    useEffect(() => {

        const t = setTimeout(() => searchBae(), 250)

        return () => clearTimeout(t)

    }, [keywords, tags, langs])

    useEffect(() => {
        const queryParameters = new URLSearchParams(location.search);
        const keyword = queryParameters.get('keyword');
        if(keyword) {
            setKeywords(keyword)
            if(searchRef.current) searchRef.current.value = keyword
        }
        const tag = queryParameters.get('tag');
        if(tag && !tags.includes(tag)) 
            setTags([...tags, tag])
    }, [location])

    return (
        <div className='h-full w-full flex gap-[1rem] p-4'>
            <div className='flex-grow flex flex-col gap-1'>
                <div className='h-[80px] flex items-center px-8  py-4 bg-[#0d0d0d] rounded-t-[1rem]'>
                    <div className='cursor-pointer' onClick={() => navigate('/explore')}>
                        <ArrowLeft />
                    </div>
                    <div className='h-full w-[1px] mx-4 bg-[#b8bccf]'></div>
                    <div className="flex-grow flex items-center gap-3 border-[2px] border-[#2b2e3b] rounded-[1.5rem] px-[1rem] py-[0.5rem] bg-[#17181c] ">
                        <SearchSVG />
                        <input ref={searchRef} className="w-full outline-none bg-transparent leading-[24px]" autoFocus placeholder="Search BAE ..."
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>        
                </div>
                {/* Search Result */}
                <div className='flex-grow bg-[#0d0d0d] rounded-b-[1rem] p-4 overflow-y-auto thin-scroll'>
                    {
                        scrollData &&
                        <InfiniteScroll
                            dataLength={scrollData.length}
                            next={handleOnRowsScrollEnd}
                            hasMore={hasMoreValue}
                            scrollThreshold={1}
                            loader={<Loading />}
                            // Let's get rid of second scroll bar
                            style={{ overflow: "unset" }}
                        >
                            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {
                                    scrollData.map( (item: ICharacter, idx) =>
                                        <SearchItem key={idx} character={item} />
                                    )
                                }
                            </div>
                        </InfiniteScroll>
                    }
                </div>
                {/* <div className='flex-grow bg-[#0d0d0d] rounded-b-[1rem] overflow-y-auto thin-scroll'>
                    <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 p-4">
                        {
                            result.map( (item: ICharacter, idx) =>
                                <SearchItem key={idx} character={item} />
                            )
                        }
                    </div>
                </div> */}
            </div>
            <div className='w-[240px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto thin-scroll'>
                <div className='w-full flex flex-col gap-4 p-4 bg-[#0d0d0d] rounded-[1rem]'>
                    <div className='flex justify-between'>
                        <span>Tags</span>
                    </div>
                    <div className='flex flex-col'>
                        {
                            tagFilter.map( (item, idx) => 
                            <div key={idx} className='flex justify-between items-center'>
                                <Checkbox color="blue" label={item} placeholder={undefined}  crossOrigin={undefined} checked={tags.includes(item.toLowerCase())}
                                    onChange={() => onChangeTag(item)}
                                />
                                {/* <span className='text-[13px] text-[#b8bccf]'>{item.num}</span> */}
                            </div>
                            )
                        }
                    </div>
                </div>
                <div className='w-full flex flex-col gap-4 p-4 bg-[#0d0d0d] rounded-[1rem]'>
                    <div className='flex justify-between'>
                        <span>Language</span>
                    </div>
                    <div className='flex flex-col'>
                        {
                            LanguagesX.map( (item:any, idx:number) => 
                                <div key={idx} className='flex justify-between items-center'>
                                    <Checkbox color="blue" label={item.localName} placeholder={undefined}  crossOrigin={undefined} 
                                        onChange={() => onChangeLang(item)}
                                    />
                                    {/* <span className='text-[13px] text-[#b8bccf]'>{item.num}</span> */}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search;
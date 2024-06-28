import React, { useRef, useEffect, useState } from "react";
import { useNavigate, createSearchParams } from 'react-router-dom';

// import NewsCarousel from "@/components/Carousel/newsCarousel";
// import FeatureCarousel from "@/components/Carousel/featuredCarousel";
import CharacterList from "@/components/CharacterList";

import { ICharacter, INews } from "@/utils/types";
import { getAnnouncements, getHotCharacters, getFeaturedCharacters, getNewestCharacters } from "@/utils/axios";
import SearchSVG from '@/assets/images/icon/search.svg';

const Landing = (): React.JSX.Element => {

    const navigate = useNavigate()
    const searchRef = useRef<HTMLInputElement>(null)

    const [announcements, setAnnouncements] = useState<Array<INews>>([])
    const [hotCharacters, setHotCharacters] = useState<Array<ICharacter>>([])
    const [featuredCharacters, setFeaturedCharacters] = useState<Array<ICharacter>>([])
    const [newestCharacters, setNewestCharacters] = useState<Array<ICharacter>>([])

    useEffect(() => {
        getAnnouncements().then(res => {
            if(res.status == 200) setAnnouncements(res.data)
        })
        getHotCharacters().then( res => {
            if(res.status == 200) setHotCharacters(res.data)
        }).catch(err => console.log(err))

        getFeaturedCharacters().then( res => {
            if(res.status == 200) setFeaturedCharacters(res.data)
        }).catch(err => console.log(err))

        getNewestCharacters().then( res => {
            if(res.status == 200) setNewestCharacters(res.data)
        }).catch(err => console.log(err))
        
    }, [])

    function searchBae() {
        if(searchRef.current) {
            const params = { keyword: searchRef.current.value };
            navigate({ pathname: '/explore/search', search: `?${createSearchParams(params)}` });
        }
    }

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 h-[90px] px-[4rem] sticky">
                <h1 className="text-[32px] font-semibold">
                    Explore BAE
                </h1>
                <div className="flex items-center gap-3 border-[2px] border-[#2b2e3b] rounded-[1.5rem] px-[1rem] py-[0.5rem] bg-[#17181c] ">
                    <SearchSVG />
                    <input ref={searchRef} className="outline-none bg-transparent leading-[24px] lg:w-[360px]" placeholder="Search BAE ..."
                        onKeyUp={ (evt) => {
                            if(evt.key === 'Enter') searchBae()
                        }}
                    />
                </div>
            </div>
            
            <div className="w-full h-full flex flex-col gap-[2rem] pt-2 pb-[2rem] overflow-y-auto thin-scroll">
                {/* {
                    announcements && announcements.length > 0 && 
                    <NewsCarousel news={announcements} />
                } */}
                <div className="flex flex-col px-[4rem] lg:px-[6rem] gap-[2rem]">
                    {
                        hotCharacters && hotCharacters.length > 0 &&
                        <CharacterList 
                            title="Hot"
                            type="hot"
                            characters={hotCharacters}
                        />
                    }
                    {/* {
                        featuredCharacters && featuredCharacters.length > 0 &&
                        <FeatureCarousel characters={featuredCharacters} />
                    } */}
                    {
                        featuredCharacters && featuredCharacters.length > 0 &&
                        <CharacterList 
                            title="Featured"
                            type="featured"
                            characters={featuredCharacters}
                        />
                    }
                    {
                        newestCharacters && newestCharacters.length > 0 &&
                        <CharacterList 
                            title="Newest"
                            type="new"
                            characters={newestCharacters}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default Landing;
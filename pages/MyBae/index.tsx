import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import AppContext from "@/contexts/AppContext";
import CreateBae from "./CreateBae";
import BaeDetail from "./BaeDetail";
import BaeList from "@/components/BaeList";


import { getMyCharacters } from "@/utils/axios";
import { ICharacter } from "@/utils/types";

const MyBae = (): React.JSX.Element => {
    const location = useLocation();
    const queryParameters = new URLSearchParams(location.search);
    const character_id = queryParameters.get('id');

    const { auth } = useContext(AppContext)

    const [characters, setCharacters] = useState<Array<ICharacter>>([])
    const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(null)
    
    useEffect(() => {
        if(!auth.state.isConnected) return
        const data = {
            address: auth.state.address,
            chainId: auth.state.chainId
        }
        getMyCharacters(data).then( res => {
            if(res.status == 200)
                setCharacters(res.data)
        }).catch( err => console.log(err))
    }, [])

    useEffect(() => {
        // check 
        if(!auth.state.isConnected) return
        if(!character_id) setSelectedCharacter(null)
        const data = {
            address: auth.state.address,
            chainId: auth.state.chainId
        }
        getMyCharacters(data).then( res => {
            if(res.status == 200) {
                setCharacters(res.data)
                res.data.map((item: ICharacter) => {
                    if(item._id == character_id) setSelectedCharacter(item)
                })
            }
            
        }).catch( err => console.log(err))

    }, [character_id])

    return (
        <div className="w-full h-full flex">
            <div className="w-[320px] h-full hidden lg:flex flex-col gap-4 pl-4 pr-6 pt-8">
                <div className="flex items-center justify-between">
                    <span className="text-[32px] font-semibold">
                        My BAE
                    </span>
                </div>
                <BaeList list={characters} drafts={[]} selected={selectedCharacter} />
            </div>
            <div className="flex-grow h-full ">
                <Routes>
                    <Route path="/" element={ <BaeDetail character={selectedCharacter} />}/>
                    <Route path="/create" element={<CreateBae />}/>
                </Routes>
            </div>
        </div>
    )
}

export default MyBae;
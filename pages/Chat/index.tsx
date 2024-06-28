import React, { useRef, useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import AppContext from "@/contexts/AppContext";
import ChatList from "@/components/ChatList/ChatList";
import ChatRoom from "@/components/ChatRoom";
import SearchSVG from '@/assets/images/icon/search.svg';
import { IChat } from "@/utils/types";
import { getAllChats } from "@/utils/axios";

const Chat = (): React.JSX.Element => {
    const location = useLocation();
    const queryParameters = new URLSearchParams(location.search);
    const chat_id = queryParameters.get('id');

    const { auth } = useContext(AppContext)
    const searchRef = useRef(null)
    // const [searchResult, setSearchResult] = useState([]);

    const [chats, setChats] = useState<Array<IChat>>([])
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

    useEffect(() => {
        // check 
        if(!auth.state.isConnected) return
        if(!chat_id) setSelectedChat(null)
        getAllChats({
            address: auth.state.address,
            chainId: auth.state.chainId
        }).then( res => {
            if(res.status == 200) {
                setChats(res.data)
                console.log('chats => ', res.data);
                
                res.data.map((item: IChat) => {
                    if(item._id == chat_id) {
                        console.log("setSelectedChat via map: ", item);

                        setSelectedChat(item)
                    }
                })
            }
            
        }).catch(err => console.log(err))
        
        console.log("setSelectedChat: ", selectedChat);
        console.log("chat_id: ", chat_id);

    }, [chat_id])

    return (
        <div className="w-full h-full flex">
            <div className="w-[320px] h-screen hidden lg:flex flex-col gap-4 pl-4 pt-8">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[32px] font-semibold">
                        Chat
                    </span>
                </div>
                <div className="flex items-center gap-3 border-[2px] border-[#2b2e3b] rounded-[1.5rem] px-3 py-1 bg-[#17181c] ">
                    <SearchSVG />
                    <input ref={searchRef}
                        className="w-full outline-none bg-transparent text-[14px] leading-[24px]"
                        placeholder="Search in chats"
                        onKeyUp={ (evt) => {
                            if(evt.key === 'Enter') {
                                console.log('search in chats')
                            }
                        }}
                    />
                </div>
                <ChatList pinned={[]} chats={chats} 
                    selected={selectedChat}
                />
            </div>
            <div className="flex-grow h-full pl-4">
                {
                    selectedChat &&
                    <ChatRoom chat={selectedChat} />
                }
                {
                    !selectedChat &&
                    <div className="w-full h-screen flex flex-col justify-center items-center">
                        <span className="hidden lg:flex">
                            Select Character to chat
                        </span>
                        <div className="w-full h-full lg:hidden flex flex-col gap-4 pr-4 py-8">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[32px] font-semibold">
                                    Chat
                                </span>
                            </div>
                            <div className="flex items-center gap-3 border-[2px] border-[#2b2e3b] rounded-[1.5rem] px-3 py-1 bg-[#17181c] ">
                                <SearchSVG />
                                <input ref={searchRef}
                                    className="w-full outline-none bg-transparent text-[14px] leading-[24px]"
                                    placeholder="Search in chats"
                                    onKeyUp={ (evt) => {
                                        if(evt.key === 'Enter') {
                                            console.log('search in chats')
                                        }
                                    }}
                                />
                            </div>
                            <ChatList pinned={[]} chats={chats} 
                                selected={selectedChat}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Chat;
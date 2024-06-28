import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from "react-hook-form"
import { 
    Switch,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from '@material-tailwind/react';

import ImageCrop from '@/components/ImageCrop';

import AppContext from '@/contexts/AppContext';
import { updateCharacter } from '@/utils/axios';
import { ICharacter } from "@/utils/types";

import { 
    LanguagesX, 
    LANGUAGE_TO_VOICE_MAPPING_LIST,
    AnimeNFTCharacters, 
    availableChatModels
} from '@/utils/constants';
import PlusSVG from '@/assets/images/icon/plus.svg'

interface BaeDetailProps {
    character: ICharacter | null
}

const BaeDetail = ({character}: BaeDetailProps): React.JSX.Element => {
    const navigate = useNavigate();

    const { auth } = useContext(AppContext)
    const methods = useForm()
    const [uploading, setUploading] = useState<boolean>(false)
    const settingRef = useRef<HTMLDivElement>(null)
    const [characterModel, setCharacterModel] = useState<any>(null)
    const [isPublish, setIsPublish] = useState<boolean>(false)
    const [availableVoices, setAvailableVoices] = useState<Array<string>>([])
    const [avatar, setAvatar] = useState<string>("")
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [intro, setIntro] = useState<string>('')
    const [bio, setBio] = useState<string>('')
    const [language, setLanguage] = useState<any>({ 
        "code": "en",
        "name": "English", 
        "localName": "English",
    })
    const [voice, setVoice] = useState<string>('Annette')
    const [prompt, setPrompt] = useState<string>('')
    const [chatModel, setChatModel] = useState<string>('GPT 3.5')

    function trimText(str: string, limit: number) {
        return str.slice(0, limit)
    }
    
    function onChangeLanguage(lang: any) {
        setLanguage(lang)
        if(lang) {
            const voices: React.SetStateAction<string[]> = []
            LANGUAGE_TO_VOICE_MAPPING_LIST.map( item => {
                const code = item.voice.split('-')[0]
                if(code == lang['code']) voices.push(item.voice.split('-')[2].replace("Neural", ""))
            })
            setAvailableVoices(voices)
            setVoice(voices[0])
        }
    }

    function updateBaeSetting() {
        if(uploading || !character) return
        // validate address and chainId
        if(!auth.state.chainId || auth.state.address == '') {
            console.log('please connecct your wallet ...')
            return
        }
        setUploading(true)
        const formdata = new FormData()
        formdata.append('address', auth.state.address)
        formdata.append('chainId', auth.state.chainId.toString())
        formdata.append('_id', character._id)
        formdata.append('name', name)
        formdata.append('description', description)
        formdata.append('intro', intro)
        formdata.append('bio', bio)
        formdata.append('prompt', prompt)
        formdata.append('chatmodel', chatModel)
        formdata.append('lang', language['code'])
        formdata.append('voice', voice)
        formdata.append('isPublished', isPublish ? 'true' : 'false')
        formdata.append('avatar', avatar)

        formdata.forEach( (item, key) => console.log(key, '=', item))

        updateCharacter(formdata).then(res => {
            console.log(res)
            setUploading(false)
        }).catch(err => {
            console.log(err)
            setUploading(false)
        })

    }

    useEffect(() => {
        if(!character) return
        if(settingRef.current) settingRef.current.scrollTo(0,0)
        setName(character.name)
        setDescription(character.description)
        setIntro(character.intro)
        setBio(character.bio)
        setChatModel(character.chatmodel)
        setPrompt(character.prompt)
        setIsPublish(character.isPublished == "true" ? true : false)
        LanguagesX.map((item:any) => {
            if(item.code == character.lang) setLanguage(item)
        })
        setVoice(character.voice)
        AnimeNFTCharacters.map( (item: any) => {
            if(item.model == character.model)   setCharacterModel(item)
        })
        const voices: React.SetStateAction<string[]> = []
        LANGUAGE_TO_VOICE_MAPPING_LIST.map( (item: any) => {
            const code = item.voice.split('-')[0]
            if(code == character.lang) {
                voices.push(item.voice.split('-')[2].replace("Neural", ""))
            }
        })
        setAvailableVoices(voices)
    }, [character])
    
    return (
        <div className="w-full h-full">
            {
                character ?
                <FormProvider {...methods}>
                    <form className='relative h-full flex flex-col p-4'
                        onSubmit={methods.handleSubmit(updateBaeSetting)}
                    >
                        <div className="w-full h-[80px] flex items-center justify-between bg-[#171717] rounded-t-[2rem] p-[2rem]">
                            <div className="w-full flex justify-between items-end">
                                <span className='text-[24px] font-medium'>
                                    Settings
                                </span>
                                <span className="text-[#5974ff] cursor-pointer hover:underline">
                                    Preview
                                </span>
                            </div>
                        </div>
                        <div ref={settingRef} className='w-full flex-grow my-[2px] bg-[#171717] overflow-y-auto thin-scroll px-12 py-4'>
                            <div className='flex flex-col gap-6'>
                                <div className='flex justify-between gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label>Avatar</label>
                                        <div className='flex flex-col'>
                                            <ImageCrop 
                                                onSelected={(img)=>{ setAvatar(img) }}
                                            />
                                            {/* <p className='text-[13px] text-[#b8bccf]'>File types supported: JPG, PNG, WEBM. Max size: 1M</p> */}
                                        </div>
                                    </div>
                                    {
                                        characterModel &&
                                        <div className='flex flex-col gap-2'>
                                            <label>NFT Character</label>
                                            <div className='relative md:w-[128px] md:h-[128px] xl:w-[256px] xl:h-[256px] rounded-[1rem] bg-[#3d3d3d]'>
                                                <img className='w-full h-full rounded-[1rem]' alt="avatar" src={characterModel.thumbnail} />
                                            </div> 
                                        </div>
                                    }
                                </div>
                                
                                <div className='flex flex-col gap-2'>
                                    <label>* Name</label>
                                    <div className='flex items-center border-[1px] border-[#b8bccf] px-4 py-2 rounded-[1rem]'>
                                        <input className='w-full h-full bg-transparent outline-none' type='text' placeholder='Input a name of your BAE' required
                                            maxLength={30} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => {if(e.key == 'Enter') e.preventDefault()}}
                                        />
                                        <span>{name.length}/30</span>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label>Description</label>
                                    <div className='flex flex-col items-end border-[1px] border-[#b8bccf] px-4 pt-4 pb-2 rounded-[1rem]'>
                                        <textarea className='w-full h-full bg-transparent outline-none resize-none thin-scroll' placeholder='This will be showed to the others'
                                            rows={6} value={description} onChange={(e) => setDescription(trimText(e.target.value, 300))}
                                        />
                                        <span>{description.length}/300</span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-8'>
                                    <div className='flex items-center gap-4'>
                                        <label>Language</label>
                                        <Menu>
                                            <MenuHandler>
                                                <div className='rounded-[1rem] px-4 py-2 border-[1px] border-[#b8bccf] cursor-pointer'>
                                                    {language["localName"]}
                                                </div>
                                            </MenuHandler>
                                            <MenuList placeholder='language select' className='max-h-[200px]'>
                                                {
                                                    LanguagesX.map( (item, idx) => 
                                                        <MenuItem key={idx} placeholder={item["localName"]} onClick={() => onChangeLanguage(item)}>
                                                            {item["localName"]}
                                                        </MenuItem>
                                                    )
                                                }
                                            </MenuList>
                                        </Menu>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <label>Voice</label>
                                        <Menu>
                                            <MenuHandler>
                                                <div className='rounded-[1rem] px-4 py-2 border-[1px] border-[#b8bccf] cursor-pointer'>
                                                    {voice}
                                                </div>
                                            </MenuHandler>
                                            <MenuList placeholder='' className='max-h-[200px]'>
                                                {
                                                    availableVoices.map( (item, idx) => 
                                                        <MenuItem key={idx} placeholder='' onClick={() => setVoice(item)}>
                                                            {item}
                                                        </MenuItem>
                                                    )
                                                }
                                            </MenuList>
                                        </Menu>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label>Intro Message</label>
                                    <div className='flex flex-col items-end border-[1px] border-[#b8bccf] px-4 pt-4 pb-2 rounded-[1rem]'>
                                        <textarea className='w-full h-full bg-transparent outline-none resize-none thin-scroll' placeholder='This is the first message your BAE will send.'
                                            rows={4} value={intro} onChange={(e) => setIntro(trimText(e.target.value, 200))}
                                        />
                                        <span>{intro.length}/200</span>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label>Bio</label>
                                    <div className='flex flex-col items-end border-[1px] border-[#b8bccf] px-4 pt-4 pb-2 rounded-[1rem]'>
                                        <textarea className='w-full h-full bg-transparent outline-none resize-none thin-scroll' placeholder='Character bio'
                                            rows={8} value={bio} onChange={(e) => setBio(trimText(e.target.value, 500))}
                                        />
                                        <span>{bio.length}/500</span>
                                    </div>
                                </div>
                                <div className='h-[1px] bg-[#2b2e3b]'></div>
                                <div className='flex flex-col gap-4'>
                                    <span className='text-center text-[1.2rem] font-medium mb-4'>Prompt Setting</span>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-center gap-2'>
                                            <label className='flex-shrink-0'>Model Configuration</label>
                                            <Menu>
                                                <MenuHandler>
                                                    <div className='rounded-[1rem] px-4 py-2 border-[1px] border-[#b8bccf] cursor-pointer'>
                                                        {chatModel}
                                                    </div>
                                                </MenuHandler>
                                                <MenuList placeholder="chat model select">
                                                    {
                                                        availableChatModels.map( (item, idx) => 
                                                            <MenuItem key={idx} placeholder={item} onClick={() => setChatModel(item)}>
                                                                {item}
                                                            </MenuItem>
                                                        )
                                                    }
                                                </MenuList>
                                            </Menu>
                                        </div>
                                    <div>

                                    </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex justify-between'>
                                            <label>Prompt</label>

                                        </div>
                                        <div className='flex flex-col items-end border-[1px] border-[#b8bccf] px-4 pt-4 pb-2 rounded-[1rem]'>
                                            <textarea className='w-full h-full bg-transparent outline-none resize-none thin-scroll' placeholder='Input your prompt directly or modify templates.'
                                                rows={12}
                                                value={prompt} onChange={(e) => setPrompt(trimText(e.target.value, 1000))}
                                            />
                                            <span>{prompt.length}/1000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[80px] flex items-center justify-end gap-4 bg-[#171717] rounded-b-[2rem] p-[2rem]">
                            <label className='flex justify-between items-center gap-2'>
                                <span className=''>Publish BAE</span>
                                <Switch className="h-full w-full checked:bg-[#5974ff]" 
                                    crossOrigin={undefined} checked={isPublish}
                                    onChange={() => setIsPublish(!isPublish) }
                                />
                            </label>
                            <input type="submit" value={`${uploading ? "Updating ..." : "Save"}`} className={`${uploading ? "bg-[#5e8b6d] cursor-wait" : "bg-[#1e7039]"} rounded-[2rem] px-8 py-3 text-[1.2rem] font-medium cursor-pointer`} />
                        </div>
                    </form>
                </FormProvider> :
                <div className="w-full h-full flex items-center justify-center ">
                    <button className='flex items-center justify-center gap-4 p-3 rounded-[2rem] bg-[#2b2e3b]'
                        onClick={() => navigate("/mybae/create")}
                    >
                        <PlusSVG stroke='#5974ff'/>
                        <span className='text-[#5974ff]'>
                            Create a BAE
                        </span>
                    </button>
                </div>
            }
        </div>
    )
}

export default BaeDetail;
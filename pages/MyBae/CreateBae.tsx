import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { createCharacter } from '@/utils/axios';

import { 
    LanguagesX,
    LANGUAGE_TO_VOICE_MAPPING_LIST,
    AnimeNFTCharacters, 
    availableChatModels
 } from '@/utils/constants';
 import ImageAddSVG from '@/assets/images/icon/image_add.svg';
//  import ArrowLeft from '@/assets/images/icon/arrow_left.svg';
 
export default function CreateBae (): React.JSX.Element {
    const navigate = useNavigate();
    const { auth } = useContext(AppContext)
    const methods = useForm()

    const [uploading, setUploading] = useState<boolean>(false)

    const [type, setType] = useState<string>('Live2d')
    const [characterModel, setCharacterModel] = useState<any>(AnimeNFTCharacters[0])
    const [isPublish, setIsPublish] = useState<boolean>(false)
    const [availableVoices, setAvailableVoices] = useState<Array<string>>([])
    const [avatar, setAvatar] = useState<string>("")
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [intro, setIntro] = useState<string>('')
    const [bio, setBio] = useState<string>('')
    const [language, setLanguage] = useState<any>(LanguagesX[0])
    const [voice, setVoice] = useState<string>('Annette')
    const [prompt, setPrompt] = useState<string>('')
    const [chatModel, setChatModel] = useState<string>(availableChatModels[0])

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

    function completeCreateBae() {
        if(uploading) return
        // validate address and chainId
        if(!auth.state.chainId || auth.state.address == '') {
            console.log('please connecct your wallet ...')
            return
        }
        setUploading(true)
        const formdata = new FormData()
        formdata.append('address', auth.state.address)
        formdata.append('chainId', auth.state.chainId.toString())
        formdata.append('name', name)
        formdata.append('description', description)
        formdata.append('type', type)
        formdata.append('model', characterModel.model)
        formdata.append('intro', intro)
        formdata.append('bio', bio)
        formdata.append('prompt', prompt)
        formdata.append('chatmodel', chatModel)
        formdata.append('lang', language['code'])
        formdata.append('voice', voice)
        formdata.append('isPublished', isPublish ? 'true' : 'false')
        formdata.append('avatar', avatar)

        formdata.forEach( (item, key) => console.log(key, '=', item))

        createCharacter(formdata).then(res => {
            console.log(res)
            setUploading(false)
            if(res.status == 200)
                navigate('/mybae')
        }).catch(err => {
            console.log(err)
            setUploading(false)
        })

    }

    function cancelCreateBae() {
        navigate('/mybae')
    }

    useEffect(() => {
        if(!auth.state.isConnected) navigate('/mybae')
        const voices: React.SetStateAction<string[]> = []
        LANGUAGE_TO_VOICE_MAPPING_LIST.map( item => {
            const code = item.voice.split('-')[0]
            if(code == 'en') voices.push(item.voice.split('-')[2].replace("Neural", ""))
        })
        setAvailableVoices(voices)
    }, [])

    return (
        <FormProvider {...methods}>
            <form className='relative h-full flex flex-col p-4'
                onSubmit={methods.handleSubmit(completeCreateBae)}
            >
                <div className="w-full h-[80px] flex items-center justify-between bg-[#171717] rounded-t-[2rem] p-[2rem]">
                    <div>
                        <span className='text-[24px] font-medium'>
                            Create a BAE
                        </span>
                        <p className='text-[12px] text-[#b8bccf]'>
                            Customize your BAE to others. <a className='text-[#5974ff] underline cursor-pointer'>Learn More</a>
                        </p>
                    </div>
                    <label className='flex justify-between items-center gap-2'>
                        <span className=''>Publish BAE</span>
                        <Switch className="h-full w-full checked:bg-[#5974ff]" 
                            crossOrigin={undefined} checked={isPublish}
                            onChange={() => setIsPublish(!isPublish) }
                        />
                    </label>
                </div>
                <div className='w-full flex-grow my-[2px] bg-[#171717] overflow-y-auto thin-scroll px-12 py-4'>
                    <div className='flex flex-col gap-6'>
                        <div className='relative h-[8rem] bg-[#6ba790]'>
                            <div className='absolute opacity-0 hover:opacity-100 top-0 left-0 w-full h-full flex justify-end items-start p-4 bg-[#0007]'>
                                <div className='cursor-pointer'>
                                    <ImageAddSVG />
                                </div>
                            </div>
                            <div className='absolute bottom-[-50px] left-[30px]'>
                                <ImageCrop 
                                    onSelected={(img)=>{ setAvatar(img) }}
                                />
                            </div>
                        </div>
                        
                        <div className='flex flex-col items-end gap-2'>
                            <Menu>
                                <MenuHandler>
                                    <div className='relative w-[128px] h-[128px] rounded-[1rem] bg-[#3d3d3d]'>
                                        {
                                            characterModel &&
                                            <img className='w-full h-full rounded-[1rem]' alt="avatar" src={characterModel.thumbnail} />
                                        }
                                        <div className='absolute opacity-0 hover:opacity-100 top-0 left-0 w-full h-full flex justify-center items-center rounded-[1rem] bg-[#0007] cursor-pointer'>
                                            <span className='text-[20px]'>
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>
                                </MenuHandler>
                                <MenuList placeholder={undefined}>
                                    <MenuItem placeholder={undefined} onClick={() => setCharacterModel(AnimeNFTCharacters[0])}>
                                        <div className='flex gap-2 items-center'>
                                            <img className='w-[32px] h-[32px] rounded-[1rem]' alt="avatar" src={AnimeNFTCharacters[0].thumbnail} />
                                            <span>{AnimeNFTCharacters[0].name}</span>
                                        </div>
                                    </MenuItem>    
                                    {/* {
                                        AnimeNFTCharacters.map( (item, idx) => 
                                            <MenuItem key={idx} placeholder={undefined} onClick={() => setCharacterModel(item)}>
                                                <div className='flex gap-2 items-center'>
                                                    <img className='w-[32px] h-[32px] rounded-[1rem]' alt="avatar" src={item.thumbnail} />
                                                    <span>{item.name}</span>
                                                </div>
                                            </MenuItem>    
                                        )
                                    } */}
                                </MenuList>
                            </Menu>
                            <label className='text-center'>Anime Character</label>
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
                            {/* TODO - play button */}
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
                    <input type="submit" value={`${uploading ? "Creating ..." : "Save"}`} className={`${uploading ? "bg-[#5e8b6d] cursor-wait" : "bg-[#1e7039]"} rounded-[2rem] px-8 py-3 text-[1.2rem] font-medium cursor-pointer`} />
                    <input type='button' value="Cancel" className='bg-[#701c2e] rounded-[2rem] px-8 py-3 text-[1.2rem] font-medium cursor-pointer'
                        onClick={() => cancelCreateBae()}
                    />
                </div>
            </form>
        </FormProvider>
    )
}
import React from 'react';
import { useDisconnect, useWeb3ModalAccount } from '@web3modal/ethers/react'

const Account = (): React.JSX.Element => {
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { disconnect } = useDisconnect()

    return (
        <>
            {
                !!isConnected && address &&
                <div className='w-full h-full flex flex-col p-4 bg-[#171717]  rounded-[2rem]'>
                    <div className='flex flex-wrap gap-1 items-center justify-end mt-8'>
                        <span className='text-[12px] px-2 py-1 rounded-md bg-[#171717] hover:text-[#5974ff] cursor-pointer'>
                            { address }
                        </span>
                        <span className='hover:text-[#5974ff] cursor-pointer p-2 rounded-[1rem] border-[1px] border-[#2b2e3b]'
                            onClick={() => disconnect()}
                        >
                            Disconnect
                        </span>
                        
                    </div>
                </div>
            }
        </>
    )
}

export default Account;
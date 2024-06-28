import React, { Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
const Account = React.lazy(() => import("./Account"))
const Membership = React.lazy(() => import("./Membership"))
const InviteToEarn = React.lazy(() => import("./InviteToEarn"))

interface ProfileMenuButtonProps {
    link: string
    title: string
}

const ProfileMenuButton = (props: ProfileMenuButtonProps): React.JSX.Element => {
    const navigate = useNavigate()

    return (
        <div className='text-[20px] px-4 py-2 rounded-[1rem] bg-[#171717] cursor-pointer'
            onClick={() => navigate(props.link)}
        >
            {props.title}
        </div>
    )
}

const Profile: React.FC = () => {

  return (
    <div className="w-full h-screen flex p-4">
      <div className="w-[320px] flex flex-col gap-4 pr-6 pt-4">
            <div className="flex items-center justify-between">
                <span className="text-[32px] font-semibold">
                    Profile
                </span>
                
            </div>
            <div className='flex flex-col gap-2'>
                <ProfileMenuButton link="/profile" title='Account' />
                <ProfileMenuButton link="/profile/membership" title='Membership' />
                <ProfileMenuButton link="/profile/invite" title='Invite & Earn' />
                <ProfileMenuButton link="/profile/rewards" title='Rewards' />
                <ProfileMenuButton link="/profile/terms" title='Terms of Service' />
                <ProfileMenuButton link="/profile/support" title='Support' />
            </div>
      </div>
      <div className="flex-grow h-full">
        <Routes>
            <Route path="/" element={ 
                <Suspense fallback={<Loading />}>
                    <Account /> 
                </Suspense>
            }/>
            <Route path="/membership" element={
                <Suspense fallback={<Loading />}>
                    <Membership /> 
                </Suspense>
            }/>
            <Route path="/invite" element={
                <Suspense fallback={<Loading />}>
                    <InviteToEarn /> 
                </Suspense>
            }/>
        </Routes>
      </div>
    </div>
  )
};

export default Profile;
 
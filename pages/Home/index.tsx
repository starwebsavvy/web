import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";

const Home: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/explore', { replace: true })
    })

    return <Loading />
}

export default Home;
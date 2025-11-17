import { useGlobal } from '../../context/GlobalContext';
import { useEffect, useState } from 'react';
import CheckInfoCCCD from './CheckInfoCCCD';
import CheckInfoVNeID from './CheckInfoVNeID';
import { getProvince } from '../../api/call_API';

export default function CheckInfo() {
    const [provinces, setProvinces] = useState([]);
    const [communes, setCommunes] = useState([]);
    const {identifyType} = useGlobal();
    const loadProvince = async () => {
        try {
            const respone = await getProvince();
            if (respone.code === "000") {
                const provinces = Object.values(
                    respone.data.reduce((acc, item) => {
                        acc[item.MA_TINH] = { MA_TINH: item.MA_TINH, TEN_TINH: item.TEN_TINH };
                        return acc;
                    }, {})
                );

                const communes = respone.data.map((item) => ({
                    MA_XA: item.MA_XA,
                    TEN_XA: item.TEN_XA,
                }));

                return { provinces, communes };
            }
            return { provinces: [], communes: [] };
        } catch (error) {
            console.error("Lỗi loadProvince:", error);
            return { provinces: [], communes: [] };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
        const { provinces, communes } = await loadProvince();
        setProvinces(provinces);
        setCommunes(communes);
        };

        fetchData();
    }, []);

    return (
        <>

        {identifyType === "cccd" ? <CheckInfoCCCD provinces={provinces} communes={communes}></CheckInfoCCCD> 
        : <CheckInfoVNeID provinces={provinces} communes={communes}></CheckInfoVNeID>}
        </>
    )
}
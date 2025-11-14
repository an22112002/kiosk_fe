import { useGlobal } from '../../context/GlobalContext';
import CheckInfoCCCD from './CheckInfoCCCD';
import CheckInfoVNeID from './CheckInfoVNeID';

export default function CheckInfo() {
    const {identifyType} = useGlobal();

    return (
        <>
        {identifyType === "cccd" ? <CheckInfoCCCD></CheckInfoCCCD> : <CheckInfoVNeID></CheckInfoVNeID>}
        </>
    )
}
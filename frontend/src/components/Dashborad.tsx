import Editor from './Editor';
import Sidebar from './Sidebar';

const Dashborad = ({ spaceInfo }: { spaceInfo: any }) => {
    return (
        <div className='w-full h-full flex'>
            <div className='w-1/6'>
                <Sidebar Structure={spaceInfo.Structure} />
            </div>
            <div className='w-5/6'>
                <Editor spaceId={spaceInfo.Id} />
            </div>
        </div>
    )
}

export default Dashborad
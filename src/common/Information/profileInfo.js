import {CloseFAQ, Edit, OpenFAQ} from '../Icons'
import {useNavigate} from "react-router-dom";

const ProfileInfo = ({ title, icon, open, onClick, children,edit }) => {
    const navigate = useNavigate()
  return (
    <div className="mt-4">
      <div className="bg-primary-100 rounded-t-lg bg-[ProfileInfo] py-[6px] px-3">
        <div className="flex justify-between items-center">
          <span className="2xl:text-2xl lg:text-lg text-base font-bold text-primary">
            {title}
          </span>
          {icon ? (
            open ? (
              <span onClick={onClick} className="cursor-pointer rounded-full bg-primary 2xl:h-8 h-6 2xl:w-8 w-6 flex justify-center items-center">
                <CloseFAQ />
              </span>
            ) : (
              <span onClick={onClick} className="cursor-pointer rounded-full bg-primary 2xl:h-8 h-6 2xl:w-8 w-6 flex justify-center items-center">
                <OpenFAQ />{' '}
              </span>
            )
          ) : (
            ''
          )}
            {edit && <span className='cursor-pointer' onClick={() => navigate('/home')}><Edit /></span>}
        </div>
      </div>
      {open && <div className="bg-white rounded-b-lg p-4">{children}</div>}
    </div>
  )
}

export const Information = ({ name, value }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="xl:text-base text-xs capitalize">
        {name}
      </div>
      <div className="xl:text-base text-xs text-black capitalize">
        {value}
      </div>
    </div>
  )
}
export default ProfileInfo

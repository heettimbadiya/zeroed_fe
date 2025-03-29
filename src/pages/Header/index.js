import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import default_user from '../../assets/user.png'
import React, { useState } from 'react'
import ROUTES_URL from '../../constant/routes'
import { ArrowDown, LogoutIcon, UserIcon } from '../../common/Icons'

const Header = ({ profile, userId }) => {
  let navigate = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate(ROUTES_URL.SIGN_IN)
  }

  return (
    <div className="bg-white px-10">
      <div className="flex justify-between items-center py-5">
        <div>
          <img src={logo} onClick={() => navigate('/home')} alt="zeroed" className="h-[1.875rem] w-[6.25rem] cursor-pointer" />
        </div>
        <div className={'flex items-center'}>
            <div className={'px-3 cursor-pointer'} onClick={() => navigate('/dashboard')}>Dashboard</div>
            <div className={'px-3 cursor-pointer'} onClick={() => navigate('/feed')}>Feed</div>
            <div className={'px-3 cursor-pointer'} onClick={() => navigate('/messaging')}>Messaging</div>
            <div className={'px-3 cursor-pointer'} onClick={() => navigate('/pricing')}>Pricing</div>
          <div className="relative cursor-pointer flex items-center">
            <div onClick={toggleMenu}>
              <div className="flex justify-center items-center gap-x-4 border border-text-border py-1 px-2 rounded-lg">
                <img
                    src={
                      profile
                          ? process.env.REACT_APP_FILE_URL + '/' + profile
                          : default_user
                    }
                    alt="profile"
                    className="bg-gray-400 rounded-full border h-6 w-6 flex items-center justify-center cursor-pointer"

                />
                <ArrowDown/>
              </div>
            </div>
            {isMenuOpen && (
                <div className="absolute right-0 top-10 mt-2 bg-white shadow-lg rounded-md z-10">
                  <div className="p-2 px-5">
                    {profile !== null && (
                        <button
                            onClick={() => {
                              toggleMenu()
                              navigate(`${ROUTES_URL.PROFILE}/${userId}`)
                            }}
                        >
                          <div className="flex justify-between items-center gap-x-2">
                            <div className="w-10">
                              <UserIcon/>
                            </div>
                            <span>Profile</span>
                          </div>
                        </button>
                    )}
                    <button
                        onClick={() => {
                          toggleMenu()
                          handleLogout()
                        }}
                    >
                      <div className="flex justify-center items-center gap-x-2">
                        <div className="w-10">
                          <LogoutIcon/>
                        </div>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

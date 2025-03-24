import React, { useEffect, useState } from 'react'
import ProfileDetails from './profileDetails'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { API_ROUTES } from '../../utils/APIs'
import { LockIcon } from '../../common/Icons'
import { PageLoading } from '../../common/Icons/Loading/pageLoading'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

    async function fetchData() {
      try {
        const response = await axios.get(
          API_ROUTES.GET_PROFILE + '/' + pathname.split('/')[2],
        )
        if (response.data.success) {
          setProfile(response.data.data)
        }
      } catch (err) {
        setError(true)
      }
    }
  useEffect(() => {
    fetchData()
  }, [pathname])

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full min-w-screen w-full">
        <div className="bg-gray-100 flex flex-col justify-center items-center sm:m-10 m-1 sm:p-10 p-2">
          <div>
            <LockIcon />
          </div>
          <div className="mt-2 text-xl font-bold">You don't have access</div>
        </div>
      </div>
    )
  }

  if (profile) {
    return (
      <div>
        <ProfileDetails data={profile} />
      </div>
    )
  }

  return <PageLoading />
}

export default Profile

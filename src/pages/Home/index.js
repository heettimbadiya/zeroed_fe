import React, { Fragment, useEffect, useState } from 'react'
import Information from './information'
import Header from '../Header'
import { API_ROUTES } from '../../utils/APIs'
import axios from 'axios'
import { PageLoading } from '../../common/Icons/Loading/pageLoading'

function Home() {
  const localUser = sessionStorage.getItem('user')
  const user = JSON.parse(localUser)

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      try {
        const response = await axios.get(
          API_ROUTES.GET_PROFILE_INFO + '/' + user?.id,
        )
        if (response?.data?.success) {
          setData(response?.data?.data)
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
        setError(true)
      }
    }
    fetchData()
  }, [user?.id])

  return (
    <Fragment>
      {/*<Header*/}
      {/*  profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}*/}
      {/*  userId={user?.id}*/}
      {/*/>*/}

      <div className="bg-grayLight min-h-screen md:px-10 px-2">
        {loading ? (
          <div className="overflow-hidden">
            <PageLoading />
          </div>
        ) : (
          <>
            <Information data={data ? data : null} />
          </>
        )}
      </div>
    </Fragment>
  )
}

export default Home

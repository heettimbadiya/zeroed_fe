import React, { useEffect, useState } from 'react'

import { PageLoading } from '../../common/Icons/Loading/pageLoading'
import { City, Country, State } from 'country-state-city'
import { ViewDateFormat } from '../../utils/dateFormat'
import { DotIcon, FailedIcon, SuccessIcon } from '../../common/Icons'

function ProfileDetails({ data }) {
  const [countryOptions, setCountryOptions] = useState([])
  const [stateOptions, setStateOptions] = useState([])

  useEffect(() => {
    const countryData = Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      name: country.name,
    }))
    setCountryOptions(countryData)
    const stateData = State.getStatesOfCountry(
      data?.basicDetails?.current_country,
    ).map((state) => ({
      value: state.isoCode,
      name: state.name,
    }))
    setStateOptions(stateData)
  }, [data?.basicDetails?.current_country])

  const current_country = countryOptions.find(
    (country) => country.value === data?.basicDetails?.current_country,
  )
  const state = stateOptions.find(
    (state) => state.value === data?.basicDetails?.current_state,
  )

  return (
    <div className="bg-white w-auto border border-gray-300 rounded-md px-4 py-8 md:m-8 m-2">
      {data ? (
        <div className="w-full lg:flex justify-between items-start xl:gap-x-10 gap-x-5">
          <div className="bg-grayLight lg:h-[calc(100vh-8.125rem)] h-full overflow-x-auto p-4 md:px-10 px-2 lg:w-[70%] ">
            {/* Image */}
            <div className="flex flex-col justify-center items-center">
              <img
                src={`${process.env.REACT_APP_FILE_URL}/${data?.basicDetails?.profile_pic}`}
                alt="profile"
                className="md:h-48 h-32 md:w-48 w-h-32 rounded-full border-8 border-gray-100"
              />
              <div className="text-blue font-bold text-xl capitalize">
                {data?.basicDetails?.firstname} {data?.basicDetails?.lastname}
              </div>
            </div>

            <div className="sm:flex gap-x-10">
              {/* Basic Information */}
              <div className="mt-10">
                <div className="text-xl font-bold text-blue mb-2">
                  Basic Information
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Fullname -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.basicDetails?.firstname}{' '}
                    {data?.basicDetails?.lastname}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Date Of Birth -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    <ViewDateFormat date={data?.basicDetails?.dob} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Gender -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.basicDetails?.gender}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Nationality -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.basicDetails?.nationality}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Country -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {current_country?.name}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    State -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {state?.name}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    City -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.basicDetails?.current_city}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Contact no. -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.basicDetails?.contact_no}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Contact email ID -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.basicDetails?.contact_email_id}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Job Preferred location -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.basicDetails?.job_preferred_location}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-10">
                <div className="text-xl font-bold text-blue mb-2">Skills</div>
                {/* Skill-1 */}
                <div>
                  <div>
                    <div className="text-sm font-medium whitespace-nowrap">
                      Core Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {data?.skills?.core_skill && (
                        <span className="bg-blue py-1.5 px-2 text-white rounded-full text-xs mr-2">
                          {data.skills.core_skill.trim()}
                        </span>
                      )}
                      {data?.skills?.core_skill_second && (
                        <span className="bg-blue py-1.5 px-2 text-white rounded-full text-xs mr-2">
                          {data.skills.core_skill_second.trim()}
                        </span>
                      )}
                      {data?.skills?.core_skill_third && (
                        <span className="bg-blue py-1.5 px-2 text-white rounded-full text-xs mr-2">
                          {data.skills.core_skill_third.trim()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-medium whitespace-nowrap">
                      Sub Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {data?.skills?.sub_skills?.[0] ? (
                        data?.skills?.sub_skills?.[0]
                          .split(',')
                          .map((skill, i) => {
                            return (
                              <span
                                key={i}
                                className="bg-blue py-1.5 px-2 text-white rounded-full text-xs mr-2"
                              >
                                {skill.trim()}
                              </span>
                            )
                          })
                      ) : (
                        <div className="h-6 text-gray-500 capitalize">
                          Sub skills
                        </div>
                      )}
                      {data?.skills?.sub_skills_second?.[0] &&
                        data?.skills?.sub_skills_second?.[0]
                          .split(',')
                          .map((skill, i) => {
                            return (
                              <span
                                key={i}
                                className="bg-blue py-1.5 px-2 text-white rounded-full text-xs mr-2"
                              >
                                {skill.trim()}
                              </span>
                            )
                          })}
                      {data?.skills?.sub_skills_third?.[0] &&
                        data?.skills?.sub_skills_third?.[0]
                          .split(',')
                          .map((skill, i) => {
                            return (
                              <span
                                key={i}
                                className="bg-blue py-1.5 px-2 text-white rounded-full text-xs mr-2"
                              >
                                {skill.trim()}
                              </span>
                            )
                          })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:flex gap-x-10">
              {/* International Education */}
              <div className="mt-10">
                <div className="text-xl font-bold text-blue mb-2">
                  International Education
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Level of Education -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.internationalEducation?.level_of_education}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Field of Study -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.internationalEducation?.field_of_study}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Year of Graduation -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.internationalEducation?.year_of_graduation}
                  </div>
                </div>
              </div>

              {/* Canadian Education */}
              <div className="mt-10">
                <div className="text-xl font-bold text-blue mb-2">
                  Canadian Education
                </div>

                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    University/college -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.canadianEducation?.university}
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    City -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.canadianEducation?.city}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Level of Education -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.canadianEducation?.level_of_education_canadian}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Field of Study -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.canadianEducation?.field_of_study_canadian}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    Year of completion -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.canadianEducation?.year_of_completion}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    GPA -
                  </div>
                  <div className="md:text-base text-sm font-medium whitespace-nowrap">
                    {data?.canadianEducation?.gpa}
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="mt-10">
              <div className="text-xl font-bold text-blue mb-2">
                Work Experience
              </div>
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-x-3">
                {data?.workExperience.map((ex, i) => {
                  console.log('Experience :', ex)
                  const country = countryOptions.find(
                    (country) => country.value === ex?.work_experience_country,
                  )
                  return (
                    <div key={i}>
                      <div className="flex items-center gap-x-2 mt-2">
                        <div className="text-lg font-semibold underline capitalize">
                          {i + 1}. {ex.work_experience_company_name}
                        </div>
                        {ex.accomplishments_id?.isVerify ? (
                          <div className="p-1 bg-green-700 rounded-full h-5 w-5 flex justify-center items-center">
                            <SuccessIcon />
                          </div>
                        ) : (
                          <div className="p-1 bg-red-700 rounded-full h-5 w-5 flex justify-center items-center">
                            <FailedIcon />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-2">
                        <div className="md:text-base text-sm">Industry -</div>
                        <div className="md:text-base text-sm">
                          {ex?.work_experience_industry}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <div className="md:text-base text-sm">
                          Sub Industry -
                        </div>
                        <div className="md:text-base text-sm">
                          {ex?.work_experience_sub_industry}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <div className="md:text-base text-sm">Country -</div>
                        <div className="md:text-base text-sm">
                          {country?.name}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <div className="md:text-base text-sm">Job Title -</div>
                        <div className="md:text-base text-sm">
                          {ex?.work_experience_job_title}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <div className="md:text-base text-sm">
                          Company Name -
                        </div>
                        <div className="md:text-base text-sm">
                          {ex?.work_experience_company_name}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <div className="md:text-base text-sm">Start Date -</div>
                        <div className="md:text-base text-sm">
                          <ViewDateFormat date={ex?.experience_start_date} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <div className="md:text-base text-sm">End Date -</div>
                        <div className="md:text-base text-sm">
                          <ViewDateFormat date={ex?.experience_end_date} />
                        </div>
                      </div>
                      <div className="gap-x-2">
                        <div className="md:text-base text-sm font-semibold">
                          Accomplishments
                        </div>
                        {ex.accomplishments_id?.accomplishment_1 && (
                          <div className="md:text-base text-sm flex items-center">
                            <DotIcon />
                            {ex.accomplishments_id?.accomplishment_1}
                          </div>
                        )}
                        {ex.accomplishments_id?.accomplishment_2 && (
                          <div className="md:text-base text-sm flex items-center">
                            <DotIcon />
                            {ex.accomplishments_id?.accomplishment_2}
                          </div>
                        )}
                        {ex.accomplishments_id?.accomplishment_3 && (
                          <div className="md:text-base text-sm flex items-center">
                            <DotIcon />
                            {ex.accomplishments_id?.accomplishment_3}
                          </div>
                        )}
                        {ex.accomplishments_id?.accomplishment_4 && (
                          <div className="md:text-base text-sm flex items-center">
                            <DotIcon />
                            {ex.accomplishments_id?.accomplishment_4}
                          </div>
                        )}
                        {ex.accomplishments_id?.accomplishment_5 && (
                          <div className="md:text-base text-sm flex items-center">
                            <DotIcon />
                            {ex.accomplishments_id?.accomplishment_5}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Career Goals */}
            <div className="mt-10">
              <div className="text-xl font-bold text-blue mb-2">
                Career Goals
              </div>
              <div className="flex flex-wrap gap-x-2">
                <div className="md:text-base text-sm font-medium whitespace-nowrap">
                  Industry -
                </div>
                <div className="md:text-base text-sm font-medium whitespace-nowrap">
                  {data?.careerGoal?.career_industry}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <div className="md:text-base text-sm font-medium whitespace-nowrap">
                  Field -
                </div>
                <div className="md:text-base text-sm font-medium whitespace-nowrap">
                  {data?.careerGoal?.career_field}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <div className="md:text-base text-sm font-medium whitespace-nowrap">
                  NOC Number -
                </div>
                <div className="md:text-base text-sm font-medium whitespace-nowrap">
                  {data?.careerGoal?.noc_number}
                </div>
              </div>
            </div>
          </div>

          {/* ----------------Video---------------- */}
          <div className="flex lg:w-[30%] w-full lg:h-[calc(100vh-8.125rem)] h-full lg:mt-0 mt-5 bg-grayLight xl:p-4 p-1">
            <div className="py-7">
              <div
                htmlFor="video"
                className="text-lg font-medium whitespace-nowrap capitalize"
              >
                Introduction
              </div>
              <div className="relative w-full h-full">
                <video controls className="w-full h-full object-cover">
                  <source
                    src={`${process.env.REACT_APP_FILE_URL}/${data?.basicDetails?.video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PageLoading />
      )}
    </div>
  )
}

export default ProfileDetails

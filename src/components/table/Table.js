import React from 'react'

const Table = () => {
  return (
    <>
<>
  {/* Container for demo purpose */}
  <div className="container my-12 py-12 mx-auto px-4 md:px-6 lg:px-12">
    {/*Section: Design Block*/}
    <section className="mb-20 text-gray-800">
      <div className="block rounded-lg shadow-lg bg-white">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full mb-0">
                  <thead className="border-b bg-gray-50 rounded-t-lg text-left">
                    <tr>
                      <th
                        scope="col"
                        className="rounded-tl-lg text-sm font-medium px-6 py-4"
                      >
                        NAME
                      </th>
                      <th scope="col" className="text-sm font-medium px-6 py-4">
                        TITLE
                      </th>
                      <th scope="col" className="text-sm font-medium px-6 py-4">
                        STATUS
                      </th>
                      <th scope="col" className="text-sm font-medium px-6 py-4">
                        ROLE
                      </th>
                      <th
                        scope="col"
                        className="rounded-tr-lg text-sm font-medium px-6 py-4"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <th
                        scope="row"
                        className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left"
                      >
                        <div className="flex flex-row items-center">
                          <img
                            className="rounded-full w-12"
                            src="https://mdbootstrap.com/img/new/avatars/9.jpg"
                            alt="Avatar"
                          />
                          <div className="ml-4">
                            <p className="mb-0.5 font-medium">Jane Cooper</p>
                            <p className="mb-0.5 text-gray-500">
                              jane.cooper@example.com
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex flex-col">
                          <p className="mb-0.5">Regional Paradigm Technican</p>
                          <p className="mb-0.5 text-gray-500">Optimization</p>
                        </div>
                      </td>
                      <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <span className="text-xs py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-green-200 text-green-600 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="align-middle text-gray-500 text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        Admin
                      </td>
                      <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <a
                          href="#!"
                          className="font-medium text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 transition duration-300 ease-in-out"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th
                        scope="row"
                        className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left"
                      >
                        <div className="flex flex-row items-center">
                          <img
                            className="rounded-full w-12"
                            src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                            alt="Avatar"
                          />
                          <div className="ml-4">
                            <p className="mb-0.5 font-medium">Cody Fisher</p>
                            <p className="mb-0.5 text-gray-500">
                              cody.fisher@example.com
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex flex-col">
                          <p className="mb-0.5">Product Directives Officer</p>
                          <p className="mb-0.5 text-gray-500">Intranet</p>
                        </div>
                      </td>
                      <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <span className="text-xs py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-yellow-200 text-yellow-600 rounded-full">
                          Pending
                        </span>
                      </td>
                      <td className="align-middle text-gray-500 text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        Owner
                      </td>
                      <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <a
                          href="#!"
                          className="font-medium text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 transition duration-300 ease-in-out"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th
                        scope="row"
                        className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left"
                      >
                        <div className="flex flex-row items-center">
                          <img
                            className="rounded-full w-12"
                            src="https://mdbootstrap.com/img/new/avatars/11.jpg"
                            alt="Avatar"
                          />
                          <div className="ml-4">
                            <p className="mb-0.5 font-medium">Esther Howard</p>
                            <p className="mb-0.5 text-gray-500">
                              esther.howard@example.com
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex flex-col">
                          <p className="mb-0.5">Forward Response Developer</p>
                          <p className="mb-0.5 text-gray-500">Directives</p>
                        </div>
                      </td>
                      <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <span className="text-xs py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-red-200 text-red-600 rounded-full">
                          Inactive
                        </span>
                      </td>
                      <td className="align-middle text-gray-500 text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        Member
                      </td>
                      <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <a
                          href="#!"
                          className="font-medium text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 transition duration-300 ease-in-out"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th
                        scope="row"
                        className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left"
                      >
                        <div className="flex flex-row items-center">
                          <img
                            className="rounded-full w-12"
                            src="https://mdbootstrap.com/img/new/avatars/15.jpg"
                            alt="Avatar"
                          />
                          <div className="ml-4">
                            <p className="mb-0.5 font-medium">Janny Wilson</p>
                            <p className="mb-0.5 text-gray-500">
                              jenny.wilson@example.com
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex flex-col">
                          <p className="mb-0.5">Central Security Manager</p>
                          <p className="mb-0.5 text-gray-500">Program</p>
                        </div>
                      </td>
                      <td className="align-middletext-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <span className="text-xs py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-blue-200 text-blue-600 rounded-full">
                          Meeting
                        </span>
                      </td>
                      <td className="align-middle text-gray-500 text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        Member
                      </td>
                      <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <a
                          href="#!"
                          className="font-medium text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 transition duration-300 ease-in-out"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th
                        scope="row"
                        className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left"
                      >
                        <div className="flex flex-row items-center">
                          <img
                            className="rounded-full w-12"
                            src="https://mdbootstrap.com/img/Photos/Avatars/img%20(1).jpg"
                            alt="Avatar"
                          />
                          <div className="ml-4">
                            <p className="mb-0.5 font-medium">Kristin Watson</p>
                            <p className="mb-0.5 text-gray-500">
                              kristin.watson@example.com
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex flex-col">
                          <p className="mb-0.5">Lead Implementation Liaison</p>
                          <p className="mb-0.5 text-gray-500">Mobility</p>
                        </div>
                      </td>
                      <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <span className="text-xs py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-green-200 text-green-600 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="align-middle text-gray-500 text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        Admin
                      </td>
                      <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <a
                          href="#!"
                          className="font-medium text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 transition duration-300 ease-in-out"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left"
                      >
                        <div className="flex flex-row items-center">
                          <img
                            className="rounded-full w-12"
                            src="https://mdbootstrap.com/img/new/avatars/2.jpg"
                            alt="Avatar"
                          />
                          <div className="ml-4">
                            <p className="mb-0.5 font-medium">
                              Danny Williamson
                            </p>
                            <p className="mb-0.5 text-gray-500">
                              danny.williamson@example.com
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex flex-col">
                          <p className="mb-0.5">
                            Internal Applications Engineer
                          </p>
                          <p className="mb-0.5 text-gray-500">Security</p>
                        </div>
                      </td>
                      <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <span className="text-xs py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-yellow-200 text-yellow-600 rounded-full">
                          Pending
                        </span>
                      </td>
                      <td className="align-middle text-gray-500 text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        Member
                      </td>
                      <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                        <a
                          href="#!"
                          className="font-medium text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 transition duration-300 ease-in-out"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/*Section: Design Block*/}
  </div>
  {/* Container for demo purpose */}
</>

    </>
  )
}

export default Table
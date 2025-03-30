import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { FaTrash, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';


const SearchBarComponent = ({ onSearch, page, setPage, size, setSize, maxPage }) => {
  const [searchParams, setSearchParams] = useState({
    ids: '',
    userName: '',
    dateStart: '',
    dateEnd: '',
    size: size,
    page: 1,
    userValidated : '',
    userCanceled : '',
    adminValidated : '',
    adminCanceled : '',
  });

  const [statuses, setStatuses] = useState({
    waiting: false,
    userValidated: false,
    userCanceled: false,
    adminValidated: false,
    adminCanceled: false,
  });

  useEffect(() => {
    setPage(1);
    setSearchParams({ ...searchParams, page: 1 });
    handleSearchWithParams(searchParams);
  }, [statuses]);

  const handleStatusToggle = (status) => {
    setStatuses((prevStatuses) => {
      const newStatuses = {
      waiting: false,
      userValidated: false,
      userCanceled: false,
      adminValidated: false,
      adminCanceled: false,
      };

      if (prevStatuses[status]) {
        return newStatuses; // Deselect all if the selected status was already true
      } else {
        newStatuses[status] = true; // Select the new status
        return newStatuses;
      }
    });
    // setStatuses((prev) => ({ ...prev, [status]: !prev[status] }));
  };


  const handleNextPage = () => {
    if (page < maxPage) {
      setPage((prevPage) => prevPage + 1);
      setSearchParams({ ...searchParams, page: page + 1 });
      handleSearchWithParams(searchParams);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      setSearchParams({ ...searchParams, page: page - 1 });
      handleSearchWithParams(searchParams);
    }
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setPage(1); // Reset to the first page when the size changes
    const updatedSearchParams = {
      ...searchParams,
      size: newSize,
      page: 1,
    };
    console.log(updatedSearchParams);
    setSearchParams(updatedSearchParams);
    handleSearchWithParams(updatedSearchParams);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Create a copy of searchParams and remove empty values
    const filteredSearchParams = Object.fromEntries(
        Object.entries(searchParams).filter(([key, value]) => value !== '')
    );
    // Pass the filtered searchParams object to the parent component for filtering
    handleSearchWithParams(filteredSearchParams);
  };

  const handleSearchWithParams = (params) => {
    let updatedSearchParams = {
      ...params,
      userValidated : "",
      userCanceled : "",
      adminValidated : "",
      adminCanceled : ""
    };
    
    if (!statuses.waiting && !statuses.userValidated && !statuses.userCanceled && !statuses.adminValidated && !statuses.adminCanceled) {
      // Aucun filtre sélectionné, ne rien envoyer
      const filteredSearchParams = Object.fromEntries(
        Object.entries(updatedSearchParams).filter(([key, value]) => value !== '')
      );
      return onSearch(filteredSearchParams);
    }

    if (statuses.waiting) {
      updatedSearchParams = {
        ...params,
        userValidated : false,
        userCanceled : false,
        adminValidated : false,
        adminCanceled : false
      };
    } else if (statuses.userValidated) {
      updatedSearchParams = {
        ...params,
        userValidated : true,
        userCanceled : false,
        adminValidated : false,
        adminCanceled : false,
      };
    } else if (statuses.userCanceled) {
      updatedSearchParams = {
        ...params,
        userValidated : true,
        userCanceled : true,
        adminValidated : false,
        adminCanceled : false,
      };
    } else if (statuses.adminValidated) {
      updatedSearchParams = {
        ...params,
        userValidated : true,
        userCanceled : false,
        adminValidated : true,
        adminCanceled : false,
      };
    } else if (statuses.adminCanceled) {
      updatedSearchParams = {
        ...params,
        adminCanceled : true,
      };
    }
    const filteredSearchParams = Object.fromEntries(
      Object.entries(updatedSearchParams).filter(([key, value]) => value !== '')
    );
    onSearch(filteredSearchParams);
  };

  const resetParams = () => {
    setSearchParams({
      ids: '',
      userName: '',
      dateStart: '',
      dateEnd: '',
      size: 50,
      page: 1,
      userValidated : '',
      userCanceled : '',
      adminValidated : '',
      adminCanceled : '',
    });
    setSize(50);
    setPage(1);
    setStatuses({
      waiting: false,
      userValidated: false,
      userCanceled: false,
      adminValidated: false,
      adminCanceled: false,
    });
    handleSearchWithParams(searchParams);
  };

  return (
    <form onSubmit={handleSearch} className=" bg-white rounded-md mb-4 shadow">
      <div className="flex flex-col 2xl:flex-row gap-4 p-4">
        <input
          type="text"
          name="ids"
          value={searchParams.ids}
          onChange={handleInputChange}
          placeholder="Ref. Commande"
          className="border px-2 py-1 rounded-md"
        />
        <input
          type="text"
          name="userName"
          value={searchParams.userName}
          onChange={handleInputChange}
          placeholder="Info Client"
          className="border px-2 py-1 rounded-md"
        />
        <input
          type="date"
          name="dateStart"
          value={searchParams.dateStart}
          onChange={handleInputChange}
          className="border px-2 py-1 rounded-md"
        />
        <input
          type="date"
          name="dateEnd"
          value={searchParams.dateEnd}
          onChange={handleInputChange}
          className="border px-2 py-1 rounded-md"
        />
        <div className="flex gap-2 items-center justify-center">
          <div
            className={`cursor-pointer px-2 py-2 rounded-full border-2 border-gray-100 ${statuses.waiting ? 'bg-gray-100' : 'bg-white'}`}
            onClick={() => handleStatusToggle('waiting')}
          >
            <FaClock className={`text-gray-600`} />
          </div>
          <div
            className={`cursor-pointer px-2 py-2 rounded-full border-2 border-blue-100 ${statuses.userValidated ? 'bg-blue-100' : 'bg-white'}`}
            onClick={() => handleStatusToggle('userValidated')}
          >
            <FaCheckCircle className={`text-blue-600`} />
          </div>
          <div
            className={`cursor-pointer px-2 py-2 rounded-full border-2 border-yellow-100 ${statuses.userCanceled ? 'bg-yellow-100' : 'bg-white'}`}
            onClick={() => handleStatusToggle('userCanceled')}
          >
            <FaExclamationTriangle className={`text-yellow-600`} />
          </div>
          <div
            className={`cursor-pointer px-2 py-2 rounded-full border-2 border-green-100 ${statuses.adminValidated ? 'bg-green-100' : 'bg-white'}`}
            onClick={() => handleStatusToggle('adminValidated')}
          >
            <FaCheckCircle className={`text-green-600`} />
          </div>
          <div
            className={`cursor-pointer px-2 py-2 rounded-full border-2 border-red-100 ${statuses.adminCanceled ? 'bg-red-100' : 'bg-white'}`}
            onClick={() => handleStatusToggle('adminCanceled')}
          >
            <FaTimesCircle className={`text-red-600`} />
          </div>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
          <button
            type="button"
            onClick={resetParams}
            className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
          >
            <FaTrash className="mr-2" />
            Reset
          </button>
        </div>
      </div>
      <div className="flex justify-center px-4 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center pr-2">
            <label htmlFor="size-selector" className="mr-2 text-gray-700">Éléments par page :</label>
            <select
              id="size-selector"
              value={size}
              onChange={handleSizeChange}
              className="border border-gray-300 px-1 py-1 rounded-md"
            >
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={300}>300</option>
              <option value={500}>500</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={handlePrevPage} className="bg-gray-500 text-white px-2 py-1 rounded-md mr-2">
              &#9664; {/* Left-pointing triangle */}
            </button>
            <div className='flex items-center whitespace-nowrap'>
            {page} / {maxPage}
            </div>
            <button type="button" onClick={handleNextPage} className="bg-gray-500 text-white px-2 py-1 rounded-md ml-2">
              &#9654; {/* Right-pointing triangle */}
            </button>
            
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBarComponent;
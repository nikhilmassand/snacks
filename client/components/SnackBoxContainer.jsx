import React, { useEffect, useState } from "react";
import SnackBox from "./SnackBox.jsx";
import { useSnackArrayContext, setSnackArrayContext } from "./SnackContext.jsx";
// import fetch from 'isomorphic-fetch'

export default function SnackBoxContainer() {
  const boxArray = useSnackArrayContext();
  const setBoxArray = setSnackArrayContext();
  const [filter, setFilter] = useState(false)

  useEffect(() => {
    console.log("in useEffect");
    fetch("/snack/")
      .then((res) => res.json())
      .then((data) => setBoxArray(data));
  }, []);

  // const search = () => {
  //   const searchQuery = document.getElementById("searchId").value;
  //   console.log("searching with: ", searchQuery);
  //   fetch("/snack/search", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify([searchQuery]),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setBoxArray(data))
  //     .catch((e) => console.log("Search request failed: ", e));
  // };

  const filterBoxes = () => {
    const searchQuery = document.getElementById("searchId").value;
    const queryArray = searchQuery.toLowerCase().split(' ')
    console.log(queryArray, 'query array')
    const filteredBoxes = [];
    console.log(boxArray)

    boxArray.forEach(el => {
      let stringOfPossibles = `${el.snack_name} ${el.brand_name} ${el.origin} ${el.type} ${el.flavor_profile}`;
      let arrayOfPossibles = stringOfPossibles.toLocaleLowerCase().split(' ');
      // console.log(arrayOfPossibles)
      let pass = false;
      for (let i = 0; i < queryArray.length; i += 1){
        if (arrayOfPossibles.includes(queryArray[i])){
          pass = true
        }
      }
      pass === true ? filteredBoxes.push(el) : null;
    })
    
    setFilter(true)
    setBoxArray(filteredBoxes)
  };

  const clearFilters = () => {
    setFilter(false)
    document.getElementById('searchId').value = '';
    console.log('clear filters')
    fetch("/snack/")
      .then((res) => res.json())
      .then((data) => setBoxArray(data))
      .catch(err => console.log('error in clear filters', err))
  }

  let filterOrClear = <button onClick={filterBoxes}>Search</button>
  if (filter) filterOrClear = <button onClick={clearFilters}>Clear Filters</button>

  return (
    <div>
      <div className='SnackBoxContainerLabel'>
        <input id="searchId" className="Search" type="text" />
        
        {filterOrClear}

        <h3>THESE ARE YOUR SNACKS</h3>
      </div>
      <div className='SnackBoxContainer'>
      {boxArray && boxArray.map((el) => <SnackBox box={el} />)}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

function App() {

  const [getitem, setgetitem] = useState([]);

  useEffect(() => {
    getdata();
    mymonth();
  }, [])

  function getdata() {

    axios.get('/grocery/getall').then((res) => {
      setgetitem(res.data);
    })
  }

  const [item, setItem] = useState({
    item: "",
    isPurchased: false
  });

  const inputEvent = (event) => {
    const { name, value } = event.target;
    setItem((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
    })
  }

  const addData = () => {
    console.log(item.groceryItem.length)
    if (item.groceryItem.length > 0) {

      setgetitem((preValue) => {
        return [...preValue, item]
      })

      const groceryData = {
        item: item.groceryItem,
        purchasestatus: item.isPurchased
      }

      axios.post('/grocery/add', groceryData)
      getdata();
      setItem({ ...item, groceryItem: '' })

    }
  }
  function updateStatus(item, index) {

    const groceryState = {
      _id: item._id,
      purchasestatus: true
    }

    axios.put('/grocery/updatePurchaseStatus', groceryState)

    getdata();
  }

  function prevEvent(event) {
    event.preventDefault();
  }

  function deleteItem(item, index) {
    const data = {
      _id: item._id

    }

    axios.delete('/grocery/deleteGroceryItem', { data });

    getdata();
  }

  const [month, setMonth] = useState()
  function mymonth() {
    var month = Intl.DateTimeFormat("en-IN", { month: "long" }).format;
    setMonth(month);
  }

  return (
    <div>
      <p className="header">Monthly Grocery Planning App</p>
      <p className="plan">Plan for the month of {month}</p>
      <form onSubmit={prevEvent} className="container1">
        <input type='text' name='groceryItem' className="addItem" placeholder=" Add Shopping Item" value={item.groceryItem} onChange={inputEvent} />
        <button className="add-btn" onClick={addData}>add</button>
        <div className="container2">
          <ul>
            {getitem.map((item, index) => {
              return <div key={index}>
                <li style={{ textDecoration: item.isPurchased ? 'line-through' : 'none' }}>{item.groceryItem}<button onClick={() => deleteItem(item, index)}>&nbsp;x&nbsp;</button><button onClick={() => updateStatus(item, index)}>Purchased</button></li>

              </div>
            }
            )}</ul>
        </div>
      </form>
    </div>
  );

}

export default App;
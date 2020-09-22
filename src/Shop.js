import React, {useState, useEffect} from 'react';
import './App.css';

function Shop() {
  useEffect(() => {
    fetchItems();
  }, []);

  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const data = await fetch('https://api.weather.gov/gridpoints/PQR/117,110/forecast');
    const items = await data.json();
    console.log(items.properties.periods);
    setItems(items.properties.periods);
  }

  const tableStyle = {
    textAlign: 'left'
  }

  return (
    <div>
      <h1>Shop Page</h1>
        <table style={tableStyle}>
          <tbody>
            {items.map(item => (
              <tr key={item.number}>
                <td key={item.number + '-name'}><h2>{item.name}</h2></td>
                <td key={item.number + '-img'}><img src={item.icon} alt={item.shortForecast} /></td>
                <td key={item.number + '-desc'}>{item.detailedForecast}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default Shop;

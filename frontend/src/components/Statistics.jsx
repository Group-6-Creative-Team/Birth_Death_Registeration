import React, { useEffect, useState } from 'react';
import DistrictBirthRates from '../components/charts/DistrictBirthRates';
import DistrictDeath from "../components/DistrictDeathRates"
import { getBirthsAndDeathsByDistrict } from '../services/districtService';

export default function Statistics() {
  const [birthData, setBirthData] = useState([]);
  const [deathData, setDeathData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBirthsAndDeathsByDistrict();
        setBirthData(result.births); // Assuming the response structure has births as an array
        setDeathData(result.deaths); // Assuming the response structure has deaths as an array
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">District Birth Rates</h3>
        <DistrictBirthRates data={birthData} /> {/* Pass the fetched birth data */}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">District Death Rates</h3>
        <DistrictDeath data={deathData} /> {/* Pass the fetched death data */}
      </div>
    </div>
  );
}

import{ useEffect, useState } from 'react';
import DashboardLayout from '../components/layout';
import {
  fetchTotalDobRecords,
  fetchTotalApprovedDobRecords,
  fetchTotalMaleBirthRecords,
  fetchTotalFemaleBirthRecords,
} from '../services/dobService';
import {
  fetchTotalDodRecords,
  fetchTotalApprovedDodRecords,
  fetchTotalMaleDeathRecords,
  fetchTotalFemaleDeathRecords,
} from '../services/dodService';
import { Users, DollarSign, FileText, Globe } from 'lucide-react';
import DistrictBirthRates from '../components/DistrictBirthRates';
import DistrictDeathRates from '../components/DistrictDeathRates';
import { getBirthsAndDeathsByDistrict } from '../services/districtService'; // Import the service to fetch district data

export default function Dashboard() {
  const [totalBirths, setTotalBirths] = useState(0);
  const [totalApprovedBirths, setTotalApprovedBirths] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalApprovedDeaths, setTotalApprovedDeaths] = useState(0);
  const [totalMaleBirths, setTotalMaleBirths] = useState(0);
  const [totalFemaleBirths, setTotalFemaleBirths] = useState(0);
  const [totalMaleDeaths, setTotalMaleDeaths] = useState(0);
  const [totalFemaleDeaths, setTotalFemaleDeaths] = useState(0);

  // State to store the birth and death data by district
  const [districtData, setDistrictData] = useState({ births: [], deaths: [] });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const totalDobResponse = await fetchTotalDobRecords();
        const totalApprovedDobResponse = await fetchTotalApprovedDobRecords();
        const totalDodResponse = await fetchTotalDodRecords();
        const totalApprovedDodResponse = await fetchTotalApprovedDodRecords();
        const maleBirthsResponse = await fetchTotalMaleBirthRecords();
        const femaleBirthsResponse = await fetchTotalFemaleBirthRecords();
        const maleDeathsResponse = await fetchTotalMaleDeathRecords();
        const femaleDeathsResponse = await fetchTotalFemaleDeathRecords();

        setTotalBirths(totalDobResponse);
        setTotalApprovedBirths(totalApprovedDobResponse);
        setTotalDeaths(totalDodResponse);
        setTotalApprovedDeaths(totalApprovedDodResponse);
        setTotalMaleBirths(maleBirthsResponse.count);
        setTotalFemaleBirths(femaleBirthsResponse.count);
        setTotalMaleDeaths(maleDeathsResponse.count);
        setTotalFemaleDeaths(femaleDeathsResponse.count);

        // Fetch the district-specific data for births and deaths
        const birthAndDeathData = await getBirthsAndDeathsByDistrict();
        setDistrictData({
          births: birthAndDeathData.births,
          deaths: birthAndDeathData.deaths,
        });
      } catch (error) {
        console.error('Error fetching totals:', error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Birth Records Card */}
        <div className="bg-pink-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalBirths}</h3>
              <p className="text-sm text-gray-500">Total Birth Records</p>
            </div>
            <div className="text-gray-500">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Approved Birth Records Card */}
        <div className="bg-green-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalApprovedBirths}</h3>
              <p className="text-sm text-gray-500">Total Approved Birth Records</p>
            </div>
            <div className="text-gray-500">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Male Birth Records Card */}
        <div className="bg-blue-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalMaleBirths}</h3>
              <p className="text-sm text-gray-500">Total Male Birth Records</p>
            </div>
            <div className="text-gray-500">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Female Birth Records Card */}
        <div className="bg-purple-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalFemaleBirths}</h3>
              <p className="text-sm text-gray-500">Total Female Birth Records</p>
            </div>
            <div className="text-gray-500">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Death Records Card */}
        <div className="bg-red-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalDeaths}</h3>
              <p className="text-sm text-gray-500">Total Death Records</p>
            </div>
            <div className="text-gray-500">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Approved Death Records Card */}
        <div className="bg-orange-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalApprovedDeaths}</h3>
              <p className="text-sm text-gray-500">Total Approved Death Records</p>
            </div>
            <div className="text-gray-500">
              <Globe className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Render District Birth Rates Chart */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">District Birth Rates</h3>
          <DistrictBirthRates birthData={districtData.births} />
        </div>

        {/* Render District Death Rates Chart */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">District Death Rates</h3>
          <DistrictDeathRates deathData={districtData.deaths} />
        </div>
      </div>
    </DashboardLayout>
  );
}

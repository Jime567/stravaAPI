async function main() {
  try {
    let stats = await getStats();
    document.querySelector('#mtb').innerHTML = (Number(stats.recent_ride_totals.distance)/1609).toFixed(0) + " miles";
    document.querySelector('#swim').innerHTML = (Number(stats.recent_swim_totals.distance)).toFixed(0) + " meters";
    document.querySelector('#run').innerHTML = (Number(stats.recent_run_totals.distance)/1609).toFixed(0) + " miles";

    document.querySelector('#mtbYear').innerHTML = (Number(stats.ytd_ride_totals.distance)/1609).toFixed(0) + " miles";
    document.querySelector('#swimYear').innerHTML = (Number(stats.ytd_swim_totals.distance)).toFixed(0) + " meters";
    document.querySelector('#runYear').innerHTML = (Number(stats.ytd_run_totals.distance)/1609).toFixed(0) + " miles";

    


  } catch (error) {
    console.error('Error in main:', error);
  }
}
main();

async function getStats() {
  try {
    const response = await fetch('https://stravaapi.jamesephelps.com/api/stravaStats');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Strava stats:', data);

    return data;
  } catch (error) {
    console.error('Fetch error in getStats:', error);
    throw error; 
  }
}


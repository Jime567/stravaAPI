async function main() {
  try {
    let activity = await getActivity();
    document.querySelector('.title').innerHTML = activity.name;

    document.querySelector('.headerImage').src = activity.photos.primary.urls['600'];

    const date = new Date(activity.start_date_local);
    // Format the date using Intl.DateTimeFormat
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      timeZone: 'UTC' 
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    document.querySelector('.date').innerHTML = formattedDate;

    document.querySelector('.desc').innerHTML = activity.description;

    document.querySelector('#distance').innerHTML = (Number(activity.distance)/1609).toFixed(2) + " Mi.";

    const totalSeconds = activity.moving_time;
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format the time
    const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.querySelector('#time').innerHTML = formattedTime;

    document.querySelector('#elevation').innerHTML = (Number(activity.total_elevation_gain)*3.28084).toFixed(0) + " Ft";
    document.querySelector('#calories').innerHTML = activity.calories + " cal";


  } catch (error) {
    console.error('Error in main:', error);
  }
}
main();

async function getActivity() {
  try {
    const response = await fetch('http://localhost:4100/api/stravaLatest');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Strava Activities:', data);

    return data;
  } catch (error) {
    console.error('Fetch error in getActivities:', error);
    throw error; 
  }
}


window.addEventListener('message', function(event) {
  console.log("Event: " + event.data);
  if (event.data === 'getIframeHeight') {
    var iframeContentHeight = document.documentElement.scrollHeight;
    window.parent.postMessage({
      type: 'iframeHeight',
      height: iframeContentHeight
      }, '*');
    }
});

async function main() {
  try {
    let activity = await getActivity();
    document.querySelector('.title').innerHTML = activity.name;
    const title = document.querySelector('.title');
    const linkElement = document.createElement('a');
    linkElement.href = "https://www.strava.com/activities/" + activity.id;
    linkElement.target = '_blank';
    linkElement.innerHTML = title.innerHTML;
    title.innerHTML = '';
    title.appendChild(linkElement);

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
    document.querySelector('.date').innerHTML = activity.type + " on " + formattedDate;

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

    document.querySelector('.headerImage').src = activity.photos.primary.urls['600'];
    if (activity.photos.primary.urls['600'] == null) {
      switch (activity.type) {
        case "Ride":
          document.querySelector('.headerImage').src = "assets/mtbPlaceholder.webp";
          break;
        case "Run":
          document.querySelector('.headerImage').src = "assets/runPlaceholder.webp";
          break;
        case "Hike":
          document.querySelector('.headerImage').src = "assets/hikePlaceholder.webp";
          break;
        case "Walk":
          document.querySelector('.headerImage').src = "assets/hikePlaceholder.webp";
          break;
        case "Swim":
          document.querySelector('.headerImage').src = "assets/swimPlaceholder.webp";
          break;
        case "AlpineSki":
          document.querySelector('.headerImage').src = "assets/skiPlaceholder.webp";
          break;
        case "Snowshoe":
          document.querySelector('.headerImage').src = "assets/snowshoePlaceholder.webp";
          break;
        default:
          document.querySelector('.headerImage').src = "assets/mtbPlaceholder.webp";
      }
    }
    
  } catch (error) {
    console.error('Error in main:', error);
  }
}
main();

async function getActivity() {
  try {
    const response = await fetch('https://stravaapi.jamesephelps.com/api/stravaLatest');

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


window.addEventListener('message', function(event) {
  console.log("Event1: " + event.data);
  if (event.data === 'getIframeHeight1') {
    var iframeContentHeight1 = document.documentElement.scrollHeight;
    window.parent.postMessage({
      type: 'iframeHeight1',
      height: iframeContentHeight1
      }, '*');
    }
});

async function main() {
  try {
    let stats = await getStats();
    document.querySelector('#mtb').innerHTML = (Number(stats.recent_ride_totals.distance)/1609).toFixed(0) + " miles";
    document.querySelector('#swim').innerHTML = (Number(stats.recent_swim_totals.distance)).toFixed(0) + " meters";
    document.querySelector('#run').innerHTML = (Number(stats.recent_run_totals.distance)/1609).toFixed(0) + " miles";

    document.querySelector('#mtbYear').innerHTML = (Number(stats.ytd_ride_totals.distance)/1609).toFixed(0) + " miles";
    document.querySelector('#swimYear').innerHTML = (Number(stats.ytd_swim_totals.distance)).toFixed(0) + " meters";
    document.querySelector('#runYear').innerHTML = (Number(stats.ytd_run_totals.distance)/1609).toFixed(0) + " miles";

    

    makeHistory();
    
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
    // console.log('Strava stats:', data);

    return data;
  } catch (error) {
    console.error('Fetch error in getStats:', error);
    throw error; 
  }
}

async function getHistory() {
  try {
    const response = await fetch('https://stravaapi.jamesephelps.com/api/stravaActivities');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Strava activities:', data);

    return data;
  } catch (error) {
    console.error('Fetch error in getHistory:', error);
    throw error; 
  }
}


async function makeHistory() {
  var history = await getHistory();
  console.log(history);
  for (var i = 1; i < 5; i++) {
    await makeHistoryItem(history[i]);
  }
  var iframeContentHeight1 = document.documentElement.scrollHeight;
  window.parent.postMessage({
    type: 'iframeHeight1',
    height: iframeContentHeight1
    }, '*'); 
}

async function makeHistoryItem(activity) {


  // Create container div
  var container = document.createElement('div');
  container.className = 'historyItem';

  // Create image element
  var image = document.createElement('img');
  image.className = 'historyIcon';
  switch (activity.type) {
    case "Ride":
      image.src = "assets/ride.png";
      break;
    case "Run":
      image.src = "assets/running.png";
      break;
    case "Hike":
      image.src = "assets/hike.png";
      break;
    case "Walk":
      image.src = "assets/hike.webp";
      break;
    case "Swim":
      image.src = "assets/swim.png";
      break;
    case "AlpineSki":
      image.src = "assets/ski.png";
      break;
    case "Snowshoe":
      image.src = "assets/snowshoe.png";
      break;
    case "VirtualRide":
      image.src = "assets/indoor.png";
      break;
    default:
      image.src = "assets/running.png";
  }

  // Create anchor element
  var anchor = document.createElement('a');
  anchor.href = "https://www.strava.com/activities/" + activity.id;
  anchor.target = '_blank';
  // Create heading element inside the anchor
  var heading = document.createElement('h4');
  heading.textContent = activity.name;

  // Append the heading to the anchor
  anchor.appendChild(heading);

  // Create div for additional information
  var infoDiv = document.createElement('div');

  // Create paragraph for date
  const date = new Date(activity.start_date_local);
    // Format the date using Intl.DateTimeFormat
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  var dateParagraph = document.createElement('p');
  dateParagraph.textContent = formattedDate;

  // Create paragraph for miles
  var milesParagraph = document.createElement('p');
  milesParagraph.textContent = Number(activity.distance/1609).toFixed(0) + " miles";

  // Append elements to the container and infoDiv
  infoDiv.appendChild(dateParagraph);
  infoDiv.appendChild(milesParagraph);

  container.appendChild(image);
  container.appendChild(anchor);
  container.appendChild(infoDiv);

  // Append container to the body or another desired element
  document.querySelector('.history').appendChild(container);
}
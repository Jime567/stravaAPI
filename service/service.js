const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const app = express();
const path = require('path');



const port = 4100;

let clientID = process.env.stravaClientID;
let clientSecret = process.env.stravaClientSecret;
const refreshToken = process.env.stravaRefreshToken;
let stravaPerson;
let stravaActivities;
let stravaStats;
let stravaLatest;

async function getStravaData() {
    try {
        let accessToken = await refreshAccessToken(clientID, clientSecret, refreshToken);
        stravaPerson = await getStravaPerson(accessToken);
        stravaActivities = await getStravaActivities(accessToken);
        stravaStats = await getStravaStats(accessToken, stravaPerson.id);
        stravaLatest = await getStravaLatest(accessToken, stravaActivities[0].id);
    } catch (error) {
        console.error('Error in main:', error.message);
    }
}

getStravaData();

// get stuff from strava every 5 minutes
cron.schedule('*/5 * * * *', () => {
    getStravaData();
});

// JSON parsing middleware
app.use(express.json());

// router for service endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/stravaPerson', (req, res) => {
    res.send(stravaPerson);
});

apiRouter.get('/stravaActivities', (req, res) => {
    res.send(stravaActivities);
});

apiRouter.get('/stravaStats', (req, res) => {
    res.send(stravaStats);
});

apiRouter.get('/stravaLatest', (req, res) => {
    res.send(stravaLatest);
});

// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

async function getStravaPerson(accessToken) {
    const apiUrl = 'https://www.strava.com/api/v3/athlete';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            });

            if (!response.ok) {
                throw new Error('Failed to get person');
            }

            const data = await response.json();
            return data;
    } catch (error) {
        console.error('Error getting person:', error.message);
        throw error;
    }

}

async function getStravaLatest(accessToken, activityId) {
    const apiUrl = 'https://www.strava.com/api/v3/activities/' + activityId;
    const queryParams = 'resolution=medium'; 
    try {
        const response = await fetch(`${apiUrl}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            });

            if (!response.ok) {
                throw new Error('Failed to get activities');
            }

            const data = await response.json();
            return data;
    } catch (error) {
        console.error('Error getting activities:', error.message);
        throw error;
    }

}

async function getStravaActivities(accessToken) {
    const apiUrl = 'https://www.strava.com/api/v3/athlete/activities';
    const queryParams = 'per_page=5'; //get 5 most recent activities
    try {
        const response = await fetch(`${apiUrl}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            });

            if (!response.ok) {
                throw new Error('Failed to get activities');
            }

            const data = await response.json();
            return data;
    } catch (error) {
        console.error('Error getting activities:', error.message);
        throw error;
    }

}

async function getStravaStats(accessToken, athleteID) {
    const apiUrl = 'https://www.strava.com/api/v3/athletes/' + athleteID + '/stats';
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            });

            if (!response.ok) {
                throw new Error('Failed to get stats');
            }

            const data = await response.json();
            return data;
    } catch (error) {
        console.error('Error getting stats:', error.message);
        throw error;
    }

}

async function refreshAccessToken(clientId, clientSecret, refreshToken) {
    const tokenEndpoint = 'https://www.strava.com/api/v3/oauth/token';

    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);

    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json();
        const newAccessToken = data.access_token;
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error.message);
        throw error;
    }
}

const httpService = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

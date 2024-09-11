const eventName = document.getElementById('event');
const sessions = document.getElementById('sessions');
const sessionDate = document.getElementById('session-date');
const track = document.getElementById('track');
const radioBitesContainer = document.getElementById('radio-bites-container');
const loadMoreBtn = document.getElementById('load-more-btn');

const url = 'https://api.openf1.org/v1/'
let startingIndex = 0;
let endingIndex = 16;
let biteDataArr = [];
let driversArr = [];

const w3_open = () => {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

const w3_close = () => {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}


const fetchBites = async (session) => {
  try {
    const response = await fetch(url + `team_radio?session_key=${session}`);
    if (response.ok) {
      console.log(session)
      biteDataArr = await response.json();
      return displayBites(biteDataArr.slice(startingIndex, endingIndex));
    }
    throw new Error('Fetching audio bites failed!');
  } catch (err) {
       console.log(err);
     };
}

const fetchMoreBites = () => {
  startingIndex += 16;
  endingIndex += 16;

  displayBites(biteDataArr.slice(startingIndex, endingIndex));
  if (biteDataArr.length <= endingIndex) {
    loadMoreBtn.disabled = true;
loadMoreBtn.style.cursor = "not-allowed";
    loadMoreBtn.textContent = 'No more data to load';
  }
};

const displayBites = (bites) => {
  bites.forEach(({ date, driver_number, recording_url }, index) => {
    const driver = driversArr.find((d) => d.driver_number === driver_number )
    radioBitesContainer.innerHTML += `
    <div id="${index + startingIndex}" class="user-card">
    <div>
    <div style="display:inline-block;margin:auto;">
      <p>TIME: ${date.substring(11, 23)}</p>
        <p><span class="driver-num" style="color:#${driver.team_colour};">${driver_number} </span><span class="driver-name"> ${driver.broadcast_name}</span></p>
        <p><span class="driver-team" style="color:#${driver.team_colour};">${driver.team_name}</span></p>
      </div>
      <div style="display:inline-block;margin:auto;">
        <img src="${driver.headshot_url}" style="height:80px;vertical-align:inherit;margin:5px 5px 0 5px;" alt"driver">
      </div>
    </div>
    <audio controls>
    <source src="${recording_url}" type="audio/mpeg">
    </audio>
    <div class="red-divider"></div>
    </div>
    `;
  });
};

const fetchMeetings = async () => {
  try {
    const response = await fetch(url + `meetings?meeting_key=latest`);
    if (response.ok) {
      const data = await response.json();
      eventName.textContent = ` ${data[0].meeting_official_name}`;
      track.textContent = ` ${data[0].circuit_short_name}, ${data[0].country_name}`;
      return;
    }
    throw new Error('Fetching meetings data failed!');
  } catch(err) {
    console.log(err);

  }
};

const sessionPicker = (data) => {
  data.forEach(session => {
      sessions.innerHTML += `<option value="${session.session_key}" >${session.session_name}</option>`
      })
};

const sessionSelector = () => {
  radioBitesContainer.innerHTML = '';
  fetchBites(sessions.value);
}


const fetchSessions = async () => {
  try {
    const response = await fetch(url + `sessions?meeting_key=latest`);
    if (response.ok) {
      const data = await response.json();
      sessionPicker(data);
      sessionSelector();
      // session.textContent = ` ${data[0].session_type}`;
      const date = data[0].date_start;
      sessionDate.textContent = ` ${date.substring(0, 10)}, ${date.substring(11, 16)} (GMT: ${data[0].gmt_offset})`;
      return;
    }
    throw new Error('Fetching sessions data failed!')
  } catch(err) {
    console.log(err);
  }
}

const fetchDrivers = async () => {
  try {
    const response = await fetch(url + `drivers`);
    if (response.ok) {
      let drivers = await response.json();
      drivers.forEach((driver) => {
        driversArr.find((d) => d.driver_number === driver.driver_number ) ? '' : driversArr.push(driver);
      })

      fetchMeetings();
      fetchSessions();
    }
  } catch (err) {
    console.log(err);

  };
}

fetchDrivers()


loadMoreBtn.addEventListener('click', fetchMoreBites);

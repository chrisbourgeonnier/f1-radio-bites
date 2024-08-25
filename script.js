const eventName = document.getElementById('event');
const session = document.getElementById('session');
const sessionDate = document.getElementById('session-date');
const track = document.getElementById('track');
const radioBitesContainer = document.getElementById('radio-bites-container');
const loadMoreBtn = document.getElementById('load-more-btn');

let startingIndex = 0;
let endingIndex = 16;
let biteDataArr = [];

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}

fetch(`https://api.openf1.org/v1/team_radio?session_key=latest`)
  .then((res) => res.json())
  .then((data) => {
    biteDataArr = data;
    displayBites(biteDataArr.slice(startingIndex, endingIndex));
  })
  .catch((err) => {
    radioBitesContainer.innerHTML = '<p class="error-msg">There was an error loading the bites</p>';
  });

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
  bites.forEach(({ date, driver_number, recording_url, meeting_key, session_key }, index) => {
    radioBitesContainer.innerHTML += `
    <div id="${index + startingIndex}" class="user-card">
      <p>meeting: ${meeting_key}, session: ${session_key}</p>
      <p>date: ${date}</p>
      <h2 class="bite-name">${driver_number}</h2>
      <audio controls>
        <source src="${recording_url}" type="audio/mpeg">
      </audio>
      <div class="red-divider"></div>
    </div>
  `;
  });
};

loadMoreBtn.addEventListener('click', fetchMoreBites);

fetch(`https://api.openf1.org/v1/meetings?meeting_key=latest`)
  .then((res) => res.json())
  .then((data) => {
    eventName.textContent = ` ${data[0].meeting_official_name}`;
    track.textContent = ` ${data[0].circuit_short_name}, ${data[0].country_name}`;
  })
  .catch((err) => {
    console.log(err);
  });

fetch(`https://api.openf1.org/v1/sessions?session_key=latest`)
.then((res) => res.json())
.then((data) => {
  const date = data[0].date_start;
  sessionDate.textContent = ` ${date.substring(0, 10)}, ${date.substring(11, 16)} (GMT: ${data[0].gmt_offset})`;
  session.textContent = ` ${data[0].session_type}`;
})
.catch((err) => {
  console.log(err);
});

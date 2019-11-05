// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png';

import Manager from '../src/manager.js';
import Guest from '../src/guest.js';
import Hotel from '../src/hotel.js';

var hotel, guest, manager;

let users =
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
  .then(data => data.json())
  .then(data => data.users)
  .catch(error => console.log(error))

let rooms =
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms')
  .then(data => data.json())
  .then(data => data.rooms)
  .catch(error => console.log(error))

let bookings =
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings')
  .then(data => data.json())
  .then(data => data.bookings)
  .catch(error => console.log(error))

Promise.all([users, rooms, bookings])
  .then(allData => {
    users = allData[0]
    rooms = allData[1]
    bookings = allData[2]
    hotel = new Hotel(users, bookings, rooms);
  })

function getCurrentDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  today = `${yyyy}/${mm}/${dd}`;
  return today;
}


$('#submit').on('click', () => {
  if ($('#username').val() === 'manager' && $('#password').val() === 'overlook2019') {
    $('#login').removeClass('show');
    $('#login').addClass('hidden');
    manager = new Manager();
    instMgrDom();
  } else if ($('#username').val().includes('customer') && $('#password').val() === 'overlook2019') {
    guest = new Guest(getGuest(), users, bookings, rooms);
    $('#login').removeClass('show');
    $('#login').addClass('hidden');
    instGuestDom();
  } else {
    $('#error').text('Incorrect username or password');
  }
})

function getGuest() {
  let id = parseInt($('#username').val().slice(8));
  let newGuest = users.find(elem => elem.id === id);
  return newGuest;
}

function instMgrDom() {
  $('#available-rooms_mgr').text(hotel.availableRooms('date', getCurrentDate()).length)
  $('#total-revenue_mgr').text(hotel.calcTotalRev('date', getCurrentDate()))
  $('#percent-occupied_mgr').text(hotel.calcOccupiedPercentage('date', getCurrentDate()))
}

function instGuestDom() {
  $('#guest-total-spent').text(guest.calcTotalRev('userID', guest.id));
  displayBookings();
}

function displayBookings() {
  let bookings = guest.bookings;
  bookings.forEach((elem) => {
    $('#guest-bookings').append(
      `<div>
      <span class='booking'> Room: ${elem.roomNumber}, Date: ${elem.date}</span>
      </div>
      `
    )
  })
}

function fixDate() {
  let date = $('#date-input_guest').val();
  return date.replace(/-/g, '/')
}

$('#date-submit_guest').on('click', () => {
  let rooms = hotel.availableRooms('date', fixDate());
  rooms.forEach(room => {
    $('#available-rooms_guest').append(
      `<div>
        <span class='avail-room'> Room: ${room.number}</span>
        </div>
      `
    )
  })

  function filterRooms() {
    $('#available-rooms_guest').html('')
    let roomsToFilter = hotel.availableRooms('date', fixDate())
    let type = $('.room-types').val()
    let filtered = guest.filterByType(roomsToFilter, type);
    if (filtered.length === 0) {
      $('#available-rooms_guest').text('We\'re sorry, but there are no rooms that match your search')
    } else {
      filtered.forEach(room => {
        $('#available-rooms_guest').append(
          `<div>
        <span class='avail-room'> Room: ${room.number}</span>
        </div>`
        )
      })
    }
  }

  $('#filter-rooms').on('click', () => filterRooms())


})
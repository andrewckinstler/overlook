// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';


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

$('body').click((event) => {
  if (event.target.id === 'date-submit_guest') {
    showAvailableRooms();
  }
  if (event.target.id === 'filter-rooms') {
    filterRooms();
  }
  if (event.target.id === 'search-submit_mgr') {
    $('#user-info').html('')
    $('#user-info').append(`
    <div class='current-user-info'>
    User name: ${$('#guest-search_mgr').val()}
    <button id='add-booking_mgr'>Add room</button>
    </div>
    `)
    getGuestData($('#guest-search_mgr').val());
  }
  if (event.target.id === 'add-booking_mgr') {
    appendAddBooking();
  }
  if ($(event.target).hasClass('delete-booking')) {
    $(event.target).closest('div').remove();
  }
})


$('#submit').on('click', () => {
  if ($('#username').val() === 'manager' && $('#password').val() === '1') {
    $('#login').removeClass('show');
    $('#login').addClass('hidden');
    manager = new Manager(users, bookings, rooms);
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

function getGuestData(name) {
  const guest = manager.getGuestByName(name);
  const bookings = hotel.getBookings('userID', guest.id);
  bookings.forEach(elem => {
    $('#user-info').append(
      `<div id='booking-${elem.id}>
    <span class='booking'>
    <span>Date:</span> ${elem.date}<br>
    <span>Room:<span> ${elem.roomNumber}</span>
    <button class='delete-booking' data-booking-id='${elem.id}'>Delete</button>
    </div>
    `);
    $(`.delete-booking[data-booking-id='${elem.id}']`).on('click', function () {
      let f = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: parseInt(elem.id)
          })
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    });
  });
}



function instMgrDom() {
  $('body').html(`
  <header>
  <h1>The Hotel of Discomfort</h1>
  </header>
  <main class='dashboard'>
  <section class='sidebar'>
  <h2>Rooms available:</h2>
    <span id='available-rooms_mgr'></span>
  <h2>Revenue today:</h2>
    <span id='total-revenue_mgr'></span>
  <h2>Percent of rooms occupied</h2>  
    %<span id='percent-occupied_mgr'></span>
  </section>
  <section id='content'>
    <input id='guest-search_mgr' type="text">
    <button id='search-submit_mgr' type='submit'>Search users</button>
    <article id='user-info'></article>
  </section>
</main>`)
  $('#available-rooms_mgr').text(hotel.availableRooms('date', getCurrentDate()).length)
  $('#total-revenue_mgr').text(hotel.calcTotalRev('date', getCurrentDate()))
  $('#percent-occupied_mgr').text(hotel.calcOccupiedPercentage('date', getCurrentDate()))
}

function instGuestDom() {
  $('body').html(`
  <header>
  <h1>The Hotel of Discomfort</h1>
  </header>
  <main class='dashboard'>
  <section class='sidebar'>
    <h2>Total spent with us:</h2>
    <span id='guest-total-spent'></span>
    <h2>Your bookings:</h2>
    <span id='guest-bookings'></span>
  </section>
  <section class='content'>
    <input class='date-input' type="date">
    <button id='date-submit_guest' type='submit'>Select date</button>
    <select class='room-types'>
      <option value="select room type">Please select an option</option>
      <option value="residential suite">Residential Suite</option>
      <option value="junior suite">Junior Suite</option>
      <option value="suite">Suite</option>
      <option value="single room">Single Room</option>
    </select>
    <button id='filter-rooms' type='submit'>Filter rooms</button>
    <article id='available-rooms_guest'></article>
  </section>
</main>`)
  $('#guest-total-spent').text(guest.calcTotalRev('userID', guest.id));
  displayBookings();
}

function displayBookings() {
  let bookings = guest.bookings;
  bookings.forEach((elem) => {
    $('#guest-bookings').append(
      `<div>
      <span class='booking'>Date: ${elem.date}, Room: ${elem.roomNumber}</span>
      </div>
      `
    )
  })
}


function fixDate() {
  let date = $('.date-input').val();
  return date.replace(/-/g, '/')
}

function showAvailableRooms() {
  $('#available-rooms_guest').html('')
  let availableRooms = hotel.availableRooms('date', fixDate());
  availableRooms.forEach(room => {
    $('#available-rooms_guest').append(
      `<div>
        <span class='avail-room'> Room: ${room.number}</span>
        <button class='book-room' data-roomnumber='${room.number}'>One-click book!</button>
        </div>
      `
    )
  })
  $('#available-rooms_guest .book-room').each(function () {
    const button = $(this);
    button.on('click', function () {
      hotel.bookNow(button.attr('data-roomnumber'), guest.id, fixDate(), (data) => {
        $(`[data-roomnumber=${data.roomNumber}]`).text('Booked!')
        $('#guest-bookings').append(
          `<div>
          <span class='booking'>Date: ${fixDate()}, Room: ${data.roomNumber}</span>
          </div>`)
      });
    })
  })
}

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

function appendAddBooking() {
  $('.current-user-info').append(`
  <div>
  <input class='date-input' type="date"> 
  <select id='pick-rooms_mgr' disabled>
    <option value=''>Select a room</option>
  </select>
  <button class='book-room' disabled>Book room</button>
  </div>
  `)
  $('.current-user-info .date-input').on('change', function () {
    const dateInput = $(this);
    if (dateInput.val()) {
      appendOptions()
    }

  })
}

function appendOptions() {
  const pickRoomSelect = $('#pick-rooms_mgr');
  const bookButton = $('.current-user-info .book-room');
  let availableRooms = hotel.availableRooms('date', fixDate());
  availableRooms.forEach(room => {
    pickRoomSelect.append(`
      <option value='${room.number}'>Room ${room.number}</option>
      `)
  })
  pickRoomSelect.attr('disabled', false);
  pickRoomSelect.on('change', function () {
    if (pickRoomSelect.val()) {
      bookButton.attr('disabled', false);
      bookButton.on('click', () => {
        let guestData = manager.getGuestByName($('#guest-search_mgr').val())
        hotel.bookNow(pickRoomSelect.val(), guestData.id, fixDate(), (data) => {
          bookButton.text('Booked!');
        })
      })
    }
  })
}
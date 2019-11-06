class Hotel {
  constructor(users, bookings, rooms) {
    this.users = users;
    this.bookings = bookings;
    this.rooms = rooms;
    this.currentUser;
  }

  getBookings(key, val) {
    let booked = this.bookings.filter(elem => elem[key] === val)
    return booked;
  }

  availableRooms(key, val) {
    let booked = this.getBookings(key, val).map(elem => elem.roomNumber)
    let available = this.rooms.reduce((acc, room) => {
      if(!booked.includes(room.number)){
        acc.push(room)
      }
      return acc;
    }, [])
    return available;
  }

  calcTotalRev(key, val) {
    let booked = this.getBookings(key, val);
    let total = booked.reduce((acc, cur) => {
      this.rooms.forEach(elem => {
        if (cur.roomNumber === elem.number) {
          acc += elem.costPerNight
        }
      })
      return acc;
    }, 0)
    return parseFloat(total.toFixed(2));
  }

  calcOccupiedPercentage(key, value) {
    return parseInt(((this.getBookings(key, value).length / this.rooms.length) * 100).toFixed(2))
  }

  bookNow(roomNumber, id, date, callback) {
    let item = {
      "userID": id,
      "date": date,
      "roomNumber": parseInt(roomNumber)
    }
    fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => callback(data))
  }
}

export default Hotel;
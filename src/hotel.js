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
    return total;
  }

  calcOccupiedPercentage(key, value) {
    return (this.getBookings(key, value).length / this.rooms.length) * 100
  }

}

export default Hotel;
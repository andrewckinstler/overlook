import Hotel from '../src/hotel.js';

class Guest extends Hotel {
  constructor(guest, users, bookings, rooms) {
    super(users, bookings, rooms)
    this.id = guest.id;
    this.name = guest.name;
    this.bookings = this.getBookings('userID', this.id);
  }
  
  filterByType(roomList, type) {
    return roomList.filter(room => room.roomType === type)    
  }
}

export default Guest;
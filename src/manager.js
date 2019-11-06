import Hotel from '../src/Hotel.js';

class Manager extends Hotel {
  constructor(users, bookings, rooms) {
    super(users, bookings, rooms) 
  }
  getUserByName(searchedName) {
    return this.users.find(user => user.name === searchedName)
  }
}

export default Manager;
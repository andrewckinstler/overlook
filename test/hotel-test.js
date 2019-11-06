const chai = require('chai');
const expect = chai.expect;

import Hotel from '../src/hotel.js';
import Guest from '../src/guest.js';
import Manager from '../src/manager.js';

let hotel, user, manager;

let bookings = [{
  "id": 1572293130156,
  "userID": 19,
  "date": "2019/11/06",
  "roomNumber": 18,
  "roomServiceCharges": []
}, {
  "id": 1572293130159,
  "userID": 21,
  "date": "2019/11/12",
  "roomNumber": 8,
  "roomServiceCharges": []
}, {
  "id": 1572293130159,
  "userID": 12,
  "date": "2019/10/29",
  "roomNumber": 10,
  "roomServiceCharges": []
}, {
  "id": 1572293130159,
  "userID": 27,
  "date": "2019/11/15",
  "roomNumber": 4,
  "roomServiceCharges": []
}, {
  "id": 1572293130160,
  "userID": 16,
  "date": "2019/11/06",
  "roomNumber": 7,
  "roomServiceCharges": []
}, {
  "id": 1572293130160,
  "userID": 8,
  "date": "2019/11/22",
  "roomNumber": 1,
  "roomServiceCharges": []
}, {
  "id": 1572293130160,
  "userID": 3,
  "date": "2019/11/22",
  "roomNumber": 9,
  "roomServiceCharges": []
}, {
  "id": 1572293130160,
  "userID": 47,
  "date": "2019/12/09",
  "roomNumber": 14,
  "roomServiceCharges": []
}, {
  "id": 1572293130160,
  "userID": 20,
  "date": "2019/12/01",
  "roomNumber": 23,
  "roomServiceCharges": []
}, {
  "id": 1572293130160,
  "userID": 11,
  "date": "2019/11/22",
  "roomNumber": 8,
  "roomServiceCharges": []
}]

let users = [{
  "id": 1,
  "name": "Leatha Ullrich"
}, {
  "id": 2,
  "name": "Rocio Schuster"
}, {
  "id": 3,
  "name": "Kelvin Schiller"
}, {
  "id": 4,
  "name": "Kennedi Emard"
}, {
  "id": 5,
  "name": "Rhiannon Little"
}, {
  "id": 6,
  "name": "Fleta Schuppe"
}, {
  "id": 7,
  "name": "Dell Rath"
}, {
  "id": 8,
  "name": "Era Hand"
}, {
  "id": 9,
  "name": "Faustino Quitzon"
}, {
  "id": 10,
  "name": "Tony Armstrong"
}]

let rooms = [{
  "number": 1,
  "roomType": "residential suite",
  "bidet": true,
  "bedSize": "queen",
  "numBeds": 1,
  "costPerNight": 358.4
}, {
  "number": 2,
  "roomType": "suite",
  "bidet": false,
  "bedSize": "full",
  "numBeds": 2,
  "costPerNight": 477.38
}, {
  "number": 3,
  "roomType": "single room",
  "bidet": false,
  "bedSize": "king",
  "numBeds": 1,
  "costPerNight": 491.14
}, {
  "number": 4,
  "roomType": "single room",
  "bidet": false,
  "bedSize": "queen",
  "numBeds": 1,
  "costPerNight": 429.44
}, {
  "number": 5,
  "roomType": "single room",
  "bidet": true,
  "bedSize": "queen",
  "numBeds": 2,
  "costPerNight": 340.17
}, {
  "number": 6,
  "roomType": "junior suite",
  "bidet": true,
  "bedSize": "queen",
  "numBeds": 1,
  "costPerNight": 397.02
}, {
  "number": 7,
  "roomType": "single room",
  "bidet": false,
  "bedSize": "queen",
  "numBeds": 2,
  "costPerNight": 231.46
}, {
  "number": 8,
  "roomType": "junior suite",
  "bidet": false,
  "bedSize": "king",
  "numBeds": 1,
  "costPerNight": 261.26
}, {
  "number": 9,
  "roomType": "single room",
  "bidet": true,
  "bedSize": "queen",
  "numBeds": 1,
  "costPerNight": 200.39
}, {
  "number": 10,
  "roomType": "suite",
  "bidet": false,
  "bedSize": "twin",
  "numBeds": 1,
  "costPerNight": 497.64
}]


describe('Hotel', () => {

  beforeEach(() => {
    hotel = new Hotel(users, bookings, rooms);
  })

  describe('Hotel instance props', () => {
    it('should be an instance of hotel', () => {
      expect(hotel).to.be.an.instanceOf(Hotel);
    })

    it('should hold a list of users', () => {
      expect(hotel.users).to.equal(users)
    })

    it('should hold a list of bookings', () => {
      expect(hotel.bookings).to.equal(bookings)
    })

    it('should hold a list of bookings', () => {
      expect(hotel.rooms).to.equal(rooms)
    })

  })
  it('should return booked rooms for a day', () => {
    expect(hotel.getBookings('date', '2019/11/22')).to.deep.equal(
      [{
          id: 1572293130160,
          userID: 8,
          date: '2019/11/22',
          roomNumber: 1,
          roomServiceCharges: []
        },
        {
          id: 1572293130160,
          userID: 3,
          date: '2019/11/22',
          roomNumber: 9,
          roomServiceCharges: []
        },
        {
          id: 1572293130160,
          userID: 11,
          date: '2019/11/22',
          roomNumber: 8,
          roomServiceCharges: []
        }
      ]);
  })

  it('should calculate revenue', () => {
    expect(hotel.calcTotalRev('date', '2019/11/22')).to.equal(820.05);
  })

  it('should return available rooms', () => {
    expect(hotel.availableRooms('date', '2019/11/22')).to.deep.equal([{
      "number": 2,
      "roomType": "suite",
      "bidet": false,
      "bedSize": "full",
      "numBeds": 2,
      "costPerNight": 477.38
    }, {
      "number": 3,
      "roomType": "single room",
      "bidet": false,
      "bedSize": "king",
      "numBeds": 1,
      "costPerNight": 491.14
    }, {
      "number": 4,
      "roomType": "single room",
      "bidet": false,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 429.44
    }, {
      "number": 5,
      "roomType": "single room",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 2,
      "costPerNight": 340.17
    }, {
      "number": 6,
      "roomType": "junior suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 397.02
    }, {
      "number": 7,
      "roomType": "single room",
      "bidet": false,
      "bedSize": "queen",
      "numBeds": 2,
      "costPerNight": 231.46
    }, {
      "number": 10,
      "roomType": "suite",
      "bidet": false,
      "bedSize": "twin",
      "numBeds": 1,
      "costPerNight": 497.64
    }]);
  })

  it('should calculate the percent of rooms occupied by day', () => {
    expect(hotel.calcOccupiedPercentage('date', '2019/11/22')).to.equal(30)
  })
})
import { FlightInterface } from "./flight.interface"

const corsProxyUrl = 'http://192.168.1.155:10000/'
const getFlightsData = async (endpoint: URL, useCorsProxy: boolean = false): Promise<Array<FlightInterface>> => {
    let target = endpoint
    if (useCorsProxy) {
        target = new URL(corsProxyUrl + target.href)
    }
    
    const res = await fetch(target.href)
    const data = await res.json()

    const flights: Array<FlightInterface> = []
    for (const key in data) {
        const aircraft = data[key]
        flights.push({
            id: key,
            icao: aircraft[0],
            lat: aircraft[1],
            lon: aircraft[2],
            track: aircraft[3],
            altitude: aircraft[4],
            groundSpeed: aircraft[5],
            squawk: aircraft[6],
            lastSeen: new Date(aircraft[10]),
            climbSpeed: aircraft[15],
            callsign: aircraft[16]
        })
    }
    return flights
}

export { getFlightsData }

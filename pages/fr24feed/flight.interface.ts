export interface FlightInterface {
    id: string
    icao: string
    lat: number // N
    lon: number // E
    track: number   // °
    altitude: number    // ft
    groundSpeed: number    // kts
    squawk: number
    lastSeen: Date
    callsign: string
    climbSpeed: number  // fpm
}

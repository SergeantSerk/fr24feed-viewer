import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { FlightInterface } from './fr24feed/flight.interface'
import { getFlightsData } from './fr24feed/flight'
import { CircleSpinner } from 'react-spinners-kit'

const flightRadar24HostUrl = new URL('https://www.flightradar24.com')

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>fr24feed viewer</title>
        <meta name="description" content="An app to interface with fr24feed and view tracked flights." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Tracked Flights</h1>
        <ListFlights></ListFlights>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

const ListFlights: NextPage = () => {
  const [flights, setFlights] = useState<Array<FlightInterface>>()

  const refreshFlightData = () => {
    getFlightsData(new URL(`http://192.168.1.155:8754/flights.json?time=${Date.now()}`), true)
      .then((flights) => {
        setFlights(flights)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    setInterval(refreshFlightData, 1000)
  }, [])

  if (!flights) {
    return (
      <CircleSpinner></CircleSpinner>
    )
  } else {
    return (
      <div className={styles.grid}>
        {
          flights.map((flight, index) => {
            const fr24Link = flight.icao && flight.callsign ? `${flightRadar24HostUrl.href}${flight.callsign}` : '#'
            return (
              <a href={fr24Link} className={styles.card} target='_blank' rel='noreferrer' key={index}>
                <p>{flight.callsign === '' ? '-' : flight.callsign}</p>
                <div>
                  <sub><b>ICAO</b> {flight.icao}</sub>
                </div>
                <div>
                  <sub><b>Latitude</b> {flight.lat !== 0 ? `${flight.lat}°N` : 'N/A'}</sub>
                </div>
                <div>
                  <sub><b>Longitude</b> {flight.lon !== 0 ? `${flight.lon}°E` : 'N/A'}</sub>
                </div>
                <div>
                  <sub><b>Track</b> {flight.track}°</sub>
                </div>
                <div>
                  <sub><b>Altitude</b> {flight.altitude} ft</sub>
                </div>
                <div>
                  <sub><b>Ground Speed</b> {flight.groundSpeed} kts</sub>
                </div>
                <div>
                  <sub><b>Squawk</b> {flight.squawk}</sub>
                </div>
                <div>
                  <sub><b>Last Seen</b> {Math.round((Date.now() / 1000) - flight.lastSeen.getTime())} seconds ago</sub>
                </div>
                <div>
                  <sub><b>Climb Speed</b> {flight.climbSpeed} fpm</sub>
                </div>
              </a>
            )
          })
        }
      </div>
    )
  }
}

export default Home

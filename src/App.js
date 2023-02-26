import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer} from '@react-google-maps/api'
import {useState, useRef} from 'react'
import { useReducedMotion } from 'framer-motion'

const center = {lat: 40.1098, lng: -88.2283}
const crime1 = {lat: 40.11072, lng: -88.21609} //700 W Green Sr, Urbana IL


function App() {

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
    libraries: ['places']
  })

  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [check, setCheck] = useState(false)

  /**@type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /**@type React.MutableRefObject<HTMLInputElement> */
  const destintationRef = useRef(); 



  if(!isLoaded) {
    return <SkeletonText/>
  }

  async function calculateRoute() {
    if(originRef.current.value === '' || destintationRef.current.value ==='') {
      return
    }
    //eslint-disable-next-line no-undef
    const directionsSerivce = new google.maps.DirectionsService()
    //sends the vals to the API
    const results = await directionsSerivce.route({
      origin: originRef.current.value, 
      destination: destintationRef.current.value, 
      //eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING
    })

    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    
    let routePoly = new google.maps.Polyline({
      path: results.routes[0].overview_path,
    });
    
    setCheck(google.maps.geometry.poly.isLocationOnEdge(
        crime1,
        routePoly,
        10e-1
      ))


  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destintationRef.current.value = ''
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      bgColor='white.200'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Being Displayed */}

        <GoogleMap 
          center = {center} 
          zoom = {15} 
          mapContainerStyle = {{width: '100%', height: '100%'}}
          onLoad = {map => setMap(map)}
        >
          {/* <Marker position = {center}/> */}

        {/* const check = React.useState(true); */}

        {check ? <Marker position = {crime1}/> : []}

          {directionsResponse && <DirectionsRenderer directions = {directionsResponse}/>}
          {/*Display Makers*/}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='modal'
      >
        <HStack spacing={10}>
          <Autocomplete options>
            <Input type='text' placeholder='Origin' ref = {originRef}/>
          </Autocomplete>
          <Autocomplete>
            <Input type='text' placeholder='Destination' ref = {destintationRef} />
          </Autocomplete>
          <ButtonGroup>
            <Button colorScheme='purple' type='submit' onClick = {calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} justifyContent='space-between'>
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App

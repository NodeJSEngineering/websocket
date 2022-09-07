const url = 'wss://myserver.com/something'
const connection = new WebSocket(url)

// When the connection is successfully established, the open event is fired.
connection.onopen = () => {
    // Sending data to the server using WebSockets
    connection.send('hey')
  }

  connection.onerror = error => {
    console.log(`WebSocket error: ${error}`)
  }

  // Receiving data from the server using WebSockets
  connection.onmessage = e => {
    console.log(e.data)
  }
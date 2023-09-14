let re = false;

const S = setInterval(() => {
    try {
      fetch('/app-api/versa')
        .then((f) => {
          ;(f.status == 200 || f.status == 304) &&
            (vt.log('Connection', 'Connection status stable; Code', f.status),
            (document.querySelector('.versa-dftm-loads').style.opacity = '0'),
            setTimeout(() => {
                if (!re) return
              const h = setInterval(() => {
                if (!socket.id) {
                  return
                }
                vt.log('WS', 'Socket ID: ' + socket.id)
                clearInterval(h)
                const i = { R: 'application/json' }
                const j = { id: socket.id }
                fetch('/socket-api/connect', {
                  method: 'POST',
                  headers: i,
                  body: JSON.stringify(j),
                })
                  .then((k) => k.json())
                  .then((k) => {
                    vt.log('WS', 'Connected to WS')
                    document.querySelector('.versa-dftm-loads').style.display =
                      'none'
                      re = false
                  })
                  .catch((k) => {
                    console.error(k)
                    const m = new ErrorModal()
                    m.title = 'Failed to connect'
                    m.body = k
                    m.spawn()
                  })
              }, 200)
            }, 200))
        })
        .catch((e) => {
          console.error(e)
          vt.log('Connection', 'Connection failed')
          document.querySelector('.versa-dftm-loads').style.opacity = '1'
          document.querySelector('.versa-dftm-loads').style.display = 'block'
          document.querySelector('.versa-dftm-loads > div > p').innerText =
            'Connection Failed...'
            re = true;
        })
    } catch (e) {
      console.error(e)
      vt.log('Connection', 'Connection failed')
      document.querySelector('.versa-dftm-loads').style.opacity = '1'
      document.querySelector('.versa-dftm-loads').style.display = 'block'
      document.querySelector('versa-dftm-loads > div > p').innerText =
        'Connection Failed...'
        re = true
        
    }
  }, 10000)